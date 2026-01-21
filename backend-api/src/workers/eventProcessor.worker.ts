import { prisma } from '../config/prisma';
import { io } from '../config/websocket';
import { EventOutbox } from '@prisma/client';

type EventHandler = (event: EventOutbox) => Promise<void>;

export class EventProcessorWorker {
  private isRunning = false;
  private readonly maxRetries = 3;
  private processingPromise: Promise<void> | null = null;

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('✓ EventProcessor worker started');

    // Execute every 5 seconds
    setInterval(() => {
        if (this.processingPromise) return; // Prevent overlapping runs
        this.processingPromise = this.processEvents().finally(() => {
            this.processingPromise = null;
        });
    }, 5000);
  }

  private async processEvents() {
    try {
      // Find events that are not processed
      // We fetch a batch of unprocessed events. 
      // We filter by retryCount < 20 to avoid stuck events clogging the pipeline,
      // but actual retry logic respects event.maxRetries
      const events = await prisma.eventOutbox.findMany({
        where: { 
          processed: false, 
          retryCount: { lt: 20 } 
        },
        orderBy: [
            { createdAt: 'asc' }
        ],
        take: 50
      });

      if (events.length === 0) return;

      for (const event of events) {
        if (this.shouldRetry(event)) {
             await this.processEvent(event);
        }
      }
    } catch (error) {
      console.error('[EventProcessor] Query error:', error);
    }
  }

  private shouldRetry(event: EventOutbox): boolean {
      // Use event-specific maxRetries if available (it is in schema)
      if (event.retryCount >= event.maxRetries) return false;
      
      // If never retried or no updatedAt, retry immediately (or it's first run)
      if (event.retryCount === 0) return true;
      
      // Since we added updatedAt to schema, it should be available. 
      // Fallback to createdAt if updatedAt is somehow missing/null (though schema says non-nullable)
      const lastAttempt = event.updatedAt || event.createdAt;
      
      // Exponential backoff: 5s, 25s, 125s...
      const backoffSeconds = Math.pow(5, event.retryCount); 
      const nextRetry = new Date(lastAttempt.getTime() + backoffSeconds * 1000);
      return new Date() >= nextRetry;
  }

  private async processEvent(event: EventOutbox) {
    try {
      const handler = this.getHandler(event.eventType);
      
      if (handler) {
        await handler(event);
      } else {
        console.warn(`[EventProcessor] No handler for ${event.eventType}`);
        // If no handler, maybe mark as processed or ignore? 
        // For now, let's mark processed so we don't loop forever on unknown events
        // But in strict system, maybe move to DLQ.
      }

      await prisma.eventOutbox.update({
        where: { id: event.id },
        data: {
          processed: true,
          processedAt: new Date(),
          lastError: null // Clear error if success
        }
      });
      
      console.log(`✓ Event processed: ${event.eventType} (${event.aggregateId})`);

    } catch (error) {
      await this.handleError(event, error);
    }
  }

  private getHandler(eventType: string): EventHandler | null {
    const handlers: Record<string, EventHandler> = {
      'ORDER_CREATED': async (event) => {
        // Emit socket event to 'admin' and 'vendor' rooms
        // Payload comes as JsonValue, need cast
        const payload = event.payload as any;
        io.to('roles:admin').to('roles:cafeteria_staff').emit('new_order', payload);
      },
      'ORDER_STATUS_UPDATED': async (event) => {
        // Emit to specific user room
        const { userId, orderId, status } = event.payload as any;
        if (userId) {
          io.to(`user:${userId}`).emit('order_update', { orderId, status });
        }
        // Also notify staff
        io.to('roles:admin').to('roles:cafeteria_staff').emit('order_update', { orderId, status });
      },
      'PAYMENT_COMPLETED': async (event) => {
         const { userId, orderId } = event.payload as any;
         if (userId) {
             io.to(`user:${userId}`).emit('payment_success', { orderId });
         }
      },
      // Add more handlers here
    };
    return handlers[eventType] || null;
  }

  private async handleError(event: EventOutbox, error: any) {
    const retryCount = event.retryCount + 1;
    const lastError = error instanceof Error ? error.message : String(error);

    // If we hit max retries, we could potentially move to a separate DLQ table here
    // But for now, just updating retryCount and leaving processed=false acts as a DLQ 
    // (since the main query filters out retryCount >= maxRetries)
    
    await prisma.eventOutbox.update({
      where: { id: event.id },
      data: {
        retryCount,
        lastError,
        // Prisma automatically updates 'updatedAt' which we use for backoff
      }
    });
    
    console.error(`[EventProcessor] Error processing ${event.id} (Retry ${retryCount}/${this.maxRetries}): ${lastError}`);
  }
}

export const eventProcessor = new EventProcessorWorker();
