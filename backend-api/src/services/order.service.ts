import { PrismaClient, Prisma, AuditAction } from '@prisma/client';
import { prisma } from '../config/prisma';
import type { CreateOrderRequest, OrderDTO, OrderItemDTO } from '../types/index';

export class OrderService {
  /**
   * Crear nueva orden
   */
  async createOrder(userId: string, data: CreateOrderRequest): Promise<OrderDTO> {
    return await prisma.$transaction(async (tx) => {
      // 1. Validar items
      if (!data.items || data.items.length === 0) {
        throw new Error('Order must have at least one item');
      }

      // 2. Obtener productos y bloquear/verificar stock
      const productIds = data.items.map((item) => item.productId);
      
      // Locking isn't strictly necessary if we rely on atomic updates, 
      // but to ensure consistency we check availability.
      const products = await tx.product.findMany({
        where: { id: { in: productIds }, available: true },
      });

      if (products.length !== productIds.length) {
        throw new Error('Some products not found or unavailable');
      }

      let total = new Prisma.Decimal(0);
      const orderItemsData = [];

      // 3. Calcular totales y verificar stock
      for (const item of data.items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);

        const unitPrice = product.price; // Decimal from DB
        const quantity = new Prisma.Decimal(item.quantity);
        const subtotal = unitPrice.mul(quantity);
        
        total = total.add(subtotal);

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: unitPrice,
          subtotal: subtotal
        });
        
        // Decrement stock atomically ensuring non-negative result
        // This acts as a pessimistic lock/concurrency control
        const updateResult = await tx.product.updateMany({
            where: { 
                id: product.id,
                stock: { gte: item.quantity }
            },
            data: { stock: { decrement: item.quantity } }
        });

        if (updateResult.count === 0) {
            throw new Error(`Insufficient stock for product ${product.name}`);
        }
      }

      // 4. Crear orden
      const order = await tx.order.create({
        data: {
          userId,
          total,
          notes: data.notes,
          status: 'PENDING',
          items: {
            create: orderItemsData
          }
        },
        include: {
            items: { include: { product: { include: { category: true } } } },
            user: true,
            acceptedBy: true
        }
      });

      // 5. Audit Log
      await tx.auditLog.create({
        data: {
          action: AuditAction.ORDER_CREATED,
          entityType: 'Order',
          entityId: order.id,
          userId,
          orderId: order.id,
          changes: { total: total.toString(), itemsCount: data.items.length }
        }
      });
      
      // 6. Outbox Event
      await tx.eventOutbox.create({
          data: {
              aggregateId: order.id,
              eventType: 'ORDER_CREATED',
              payload: { 
                  orderId: order.id, 
                  userId, 
                  total: total.toString(), 
                  items: orderItemsData.map(i => ({...i, unitPrice: i.unitPrice.toString(), subtotal: i.subtotal.toString()})) 
              }
          }
      });

      return this.mapOrderToDTO(order);
    });
  }

  /**
   * Obtener órdenes del usuario
   */
  async getUserOrders(userId: string, page = 1, limit = 10): Promise<any> {
    const skip = Math.max(0, (page - 1) * limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { category: true },
              },
            },
          },
          user: true,
          acceptedBy: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return {
      data: orders.map((order: any) => this.mapOrderToDTO(order)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtener orden por ID
   */
  async getOrderById(id: string): Promise<OrderDTO | null> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
        },
        user: true,
        acceptedBy: true,
      },
    });

    return order ? this.mapOrderToDTO(order) : null;
  }

  /**
   * Cancelar orden
   */
  async cancelOrder(id: string, userId: string): Promise<OrderDTO | null> {
    return await prisma.$transaction(async (tx) => {
        // 1. Verify ownership and get items for stock restoration
        const order = await tx.order.findUnique({
            where: { id },
            include: { items: true }
        });

        if (!order) throw new Error('Order not found');
        if (order.userId !== userId) throw new Error('Unauthorized');
        
        // 2. Atomic update to ensure we only cancel PENDING or PAID orders
        // Prevents race condition where order might be ACCEPTED while we are cancelling
        const result = await tx.order.updateMany({
            where: { 
                id, 
                status: { in: ['PENDING', 'PAID'] } 
            },
            data: { status: 'CANCELLED' }
        });

        if (result.count === 0) {
             throw new Error(`Cannot cancel order in ${order.status} status`);
        }

        // 3. Restore stock (only if cancellation succeeded)
        for (const item of order.items) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { increment: item.quantity } }
            });
        }

        // 4. Fetch updated order for return
        const updated = await tx.order.findUniqueOrThrow({
            where: { id },
            include: {
                items: { include: { product: { include: { category: true } } } },
                user: true,
                acceptedBy: true
            }
        });

        await tx.auditLog.create({
            data: {
                action: AuditAction.ORDER_CANCELLED,
                entityType: 'Order',
                entityId: id,
                userId,
                orderId: id,
            }
        });

        await tx.eventOutbox.create({
            data: {
                aggregateId: id,
                eventType: 'ORDER_STATUS_UPDATED',
                payload: { orderId: id, status: 'CANCELLED', userId }
            }
        });

        return this.mapOrderToDTO(updated);
    });
  }

  /**
   * Aceptar orden (staff) - Concurrency Safe
   */
  async acceptOrder(id: string, staffId: string): Promise<OrderDTO | null> {
    return await prisma.$transaction(async (tx) => {
        // Optimistic Locking: Only update if status is PAID or PENDING (depending on flow).
        // Assuming flow is PENDING -> ACCEPTED (if payment is separate or on delivery)
        // or PAID -> ACCEPTED.
        // Let's assume we can accept PENDING or PAID.
        // We use updateMany to ensure atomicity.

        const result = await tx.order.updateMany({
            where: { 
                id, 
                status: { in: ['PENDING', 'PAID'] } // Only these statuses are valid for acceptance
            },
            data: {
                status: 'ACCEPTED',
                acceptedById: staffId,
                acceptedAt: new Date()
            }
        });

        if (result.count === 0) {
            // Check why it failed
            const order = await tx.order.findUnique({ where: { id } });
            if (!order) throw new Error('Order not found');
            if (order.acceptedById) throw new Error('Order already accepted by another vendor');
            throw new Error(`Cannot accept order in ${order.status} status`);
        }

        // Fetch updated order
        const updated = await tx.order.findUniqueOrThrow({
            where: { id },
            include: {
                items: { include: { product: { include: { category: true } } } },
                user: true,
                acceptedBy: true
            }
        });

        await tx.auditLog.create({
            data: {
                action: AuditAction.ORDER_ACCEPTED,
                entityType: 'Order',
                entityId: id,
                userId: staffId,
                orderId: id,
            }
        });

        await tx.eventOutbox.create({
            data: {
                aggregateId: id,
                eventType: 'ORDER_STATUS_UPDATED',
                payload: { orderId: id, status: 'ACCEPTED', userId: updated.userId, acceptedBy: staffId }
            }
        });

        return this.mapOrderToDTO(updated);
    });
  }

  /**
   * Marcar como listo
   */
  async markOrderReady(id: string, staffId: string): Promise<OrderDTO | null> {
    return await prisma.$transaction(async (tx) => {
        // Atomic update with status check
        const result = await tx.order.updateMany({
            where: { 
                id, 
                status: 'ACCEPTED' 
            },
            data: {
                status: 'READY',
                readyAt: new Date()
            }
        });

        if (result.count === 0) {
             const order = await tx.order.findUnique({ where: { id } });
             if (!order) throw new Error('Order not found');
             throw new Error(`Cannot mark ready order in ${order.status} status`);
        }

        const updated = await tx.order.findUniqueOrThrow({
            where: { id },
            include: {
                items: { include: { product: { include: { category: true } } } },
                user: true,
                acceptedBy: true
            }
        });

        await tx.auditLog.create({
            data: {
                action: AuditAction.ORDER_READY,
                entityType: 'Order',
                entityId: id,
                userId: staffId,
                orderId: id,
            }
        });

        await tx.eventOutbox.create({
            data: {
                aggregateId: id,
                eventType: 'ORDER_STATUS_UPDATED',
                payload: { orderId: id, status: 'READY', userId: updated.userId }
            }
        });

        return this.mapOrderToDTO(updated);
    });
  }

  /**
   * Marcar como completada/entregada
   */
  async completeOrder(id: string, staffId: string): Promise<OrderDTO | null> {
    return await prisma.$transaction(async (tx) => {
        const result = await tx.order.updateMany({
            where: { 
                id, 
                status: 'READY' 
            },
            data: {
                status: 'COMPLETED',
                completedAt: new Date()
            }
        });

        if (result.count === 0) {
             const order = await tx.order.findUnique({ where: { id } });
             if (!order) throw new Error('Order not found');
             throw new Error(`Cannot complete order in ${order.status} status`);
        }

        const updated = await tx.order.findUniqueOrThrow({
            where: { id },
            include: {
                items: { include: { product: { include: { category: true } } } },
                user: true,
                acceptedBy: true
            }
        });

        await tx.auditLog.create({
            data: {
                action: AuditAction.ORDER_COMPLETED,
                entityType: 'Order',
                entityId: id,
                userId: staffId,
                orderId: id,
            }
        });

        await tx.eventOutbox.create({
            data: {
                aggregateId: id,
                eventType: 'ORDER_STATUS_UPDATED',
                payload: { orderId: id, status: 'COMPLETED', userId: updated.userId }
            }
        });

        return this.mapOrderToDTO(updated);
    });
  }

  /**
   * Mapear orden a DTO
   */
  private mapOrderToDTO(order: any): OrderDTO {
    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      total: order.total.toString(),
      notes: order.notes,
      items: order.items.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        subtotal: item.subtotal.toString(),
        imageUrl: item.product.imageUrl,
        category: item.product.category ? {
            id: item.product.category.id,
            name: item.product.category.name
        } : undefined
      })),
      acceptedBy: order.acceptedBy ? {
        id: order.acceptedBy.id,
        email: order.acceptedBy.email,
        name: order.acceptedBy.name,
        role: order.acceptedBy.role,
        isActive: order.acceptedBy.isActive,
        createdAt: order.acceptedBy.createdAt
      } : undefined,
      acceptedAt: order.acceptedAt,
      readyAt: order.readyAt,
      completedAt: order.completedAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}

export const orderService = new OrderService();
