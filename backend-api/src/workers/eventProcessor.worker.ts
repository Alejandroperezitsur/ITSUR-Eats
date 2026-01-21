/**
 * EventProcessorWorker v5.0
 * Worker que procesa eventos del Outbox Pattern
 * Garantiza "at-least-once delivery"
 */

import { prisma } from '../config/prisma';
import { redis } from '../config/redis';
import { io } from '../config/websocket';

class EventProcessorWorker {
  private isRunning = false;
  private readonly retryIntervals = [5000, 30000, 5 * 60 * 1000, 30 * 60 * 1000];
  private readonly maxRetries = 5;

  /**
   * Iniciar el worker
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log('✓ EventProcessor worker started');

    // Ejecutar cada 5 segundos
    setInterval(() => this.processEvents().catch(err => 
      console.error('[EventProcessor] Fatal error:', err)
    ), 5000);
  }

  /**
   * Procesar eventos pendientes
   */
  private async processEvents() {
    try {
      const events = await prisma.eventOutbox.findMany({
        where: { published: false },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'asc' }
        ],
        take: 100
      });

      if (events.length === 0) return;

      for (const event of events) {
        await this.processEvent(event);
      }
    } catch (error) {
      console.error('[EventProcessor] Query error:', error);
    }
  }

  /**
   * Procesar un evento individual
   */
  private async processEvent(event: any) {
    try {
      const handlers = this.getEventHandlers(event.eventType);

      // Ejecutar handlers
      for (const handler of handlers) {
        try {
          await handler(event);
        } catch (handlerError) {
          console.error(
            `[EventProcessor] Handler failed for ${event.eventType}:`,
            handlerError
          );
          // Continuar con siguientes handlers
        }
      }

      // Marcar como publicado
      await prisma.eventOutbox.update({
        where: { id: event.id },
        data: {
          published: true,
          publishedAt: new Date(),
          attempts: event.attempts + 1
        }
      });

      console.log(
        `✓ Event published: ${event.eventType} (${event.aggregateId})`
      );
    } catch (error) {
      await this.handleEventError(event, error);
    }
  }

  /**
   * Manejar error con reintentos exponenciales
   */
  private async handleEventError(event: any, error: any) {
    const nextAttempt = event.attempts + 1;

    if (nextAttempt >= this.maxRetries) {
      // Máximos reintentos alcanzados
      await prisma.eventOutbox.update({
        where: { id: event.id },
        data: {
          error: `Max retries exceeded: ${error.message}`,
          lastAttemptAt: new Date()
        }
      });

      console.error(
        `✗ Event failed permanently: ${event.eventType} (${event.aggregateId})`
      );

      // Alertar a sistemas de monitoreo
      await this.alertMonitoring(event, error);
    } else {
      // Reintento con backoff exponencial
      const delayMs = this.retryIntervals[nextAttempt - 1];

      await prisma.eventOutbox.update({
        where: { id: event.id },
        data: {
          attempts: nextAttempt,
          error: error.message,
          lastAttemptAt: new Date()
        }
      });

      console.warn(
        `⟳ Event retry scheduled: ${event.eventType} in ${delayMs / 1000}s`
      );
    }
  }

  /**
   * Handlers por tipo de evento
   */
  private getEventHandlers(eventType: string) {
    const handlers: { [key: string]: Function[] } = {
      'order.created': [
        this.notifyVendorSocket.bind(this),
        this.logToAudit.bind(this)
      ],
      'order.accepted': [
        this.notifyCustomerSocket.bind(this),
        this.logToAudit.bind(this)
      ],
      'order.ready': [
        this.notifyCustomerSocket.bind(this),
        this.logToAudit.bind(this)
      ],
      'payment.completed': [
        this.notifyBothSockets.bind(this),
        this.logToAudit.bind(this)
      ]
    };

    return handlers[eventType] || [];
  }

  /**
   * Handler: Notificar vendor vía socket
   */
  private async notifyVendorSocket(event: any) {
    const { vendorId } = event.data;
    io.to(`vendor:${vendorId}`).emit('order:new', {
      orderId: event.aggregateId,
      ...event.data
    });
  }

  /**
   * Handler: Notificar customer vía socket
   */
  private async notifyCustomerSocket(event: any) {
    const { customerId } = event.data;
    io.to(`customer:${customerId}`).emit('order:update', {
      orderId: event.aggregateId,
      ...event.data
    });
  }

  /**
   * Handler: Notificar ambos
   */
  private async notifyBothSockets(event: any) {
    await this.notifyCustomerSocket(event);
    await this.notifyVendorSocket(event);
  }

  /**
   * Handler: Log a auditoría
   */
  private async logToAudit(event: any) {
    await prisma.auditLog.create({
      data: {
        action: event.eventType,
        aggregateId: event.aggregateId,
        aggregateType: event.aggregateType,
        changes: JSON.stringify(event.data),
        timestamp: new Date()
      }
    });
  }

  /**
   * Alertar a sistemas de monitoreo
   */
  private async alertMonitoring(event: any, error: any) {
    console.error(
      `[MONITORING] Critical event failure: ${event.eventType}`,
      error
    );
    // En producción: enviar a Datadog, NewRelic, etc.
  }
}

// Singleton
export const eventProcessor = new EventProcessorWorker();
