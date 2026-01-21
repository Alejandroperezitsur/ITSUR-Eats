import { PrismaClient } from '@prisma/client';
import type { CreateOrderRequest, OrderDTO, OrderItemDTO } from '../types/index';

const prisma = new PrismaClient();

export class OrderService {
  /**
   * Crear nueva orden
   */
  async createOrder(userId: string, data: CreateOrderRequest): Promise<OrderDTO> {
    // Validar que hay items
    if (!data.items || data.items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    // Obtener productos
    const productIds = data.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new Error('Some products not found');
    }

    // Crear items con precios
    let total: number = 0;
    const orderItems = data.items.map((item) => {
      const product = products.find((p: any) => p.id === item.productId);
      if (!product) throw new Error('Product not found');

      const subtotal = (product.price as number) * item.quantity;
      total += subtotal;

      return {
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal,
      };
    });

    // Crear orden
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        notes: data.notes,
        status: 'PENDING',
        items: {
          create: orderItems,
        },
      },
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

    // Registrar en audit log
    await prisma.auditLog.create({
      data: {
        action: 'ORDER_CREATED',
        entityType: 'Order',
        entityId: order.id,
        userId,
        orderId: order.id,
      },
    });

    return this.mapOrderToDTO(order);
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
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (!['PENDING', 'PAID'].includes(order.status)) {
      throw new Error(`Cannot cancel order in ${order.status} status`);
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
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

    // Registrar en audit
    await prisma.auditLog.create({
      data: {
        action: 'ORDER_CANCELLED',
        entityType: 'Order',
        entityId: id,
        userId,
        orderId: id,
      },
    });

    return this.mapOrderToDTO(updated);
  }

  /**
   * Aceptar orden (staff)
   */
  async acceptOrder(id: string, staffId: string): Promise<OrderDTO | null> {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'PAID') {
      throw new Error(`Cannot accept order in ${order.status} status`);
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: 'ACCEPTED',
        acceptedById: staffId,
        acceptedAt: new Date(),
      },
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

    // Registrar en audit
    await prisma.auditLog.create({
      data: {
        action: 'ORDER_ACCEPTED',
        entityType: 'Order',
        entityId: id,
        userId: staffId,
        orderId: id,
      },
    });

    return this.mapOrderToDTO(updated);
  }

  /**
   * Marcar como listo
   */
  async markOrderReady(id: string, staffId: string): Promise<OrderDTO | null> {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'ACCEPTED') {
      throw new Error(`Cannot mark ready order in ${order.status} status`);
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: 'READY',
        readyAt: new Date(),
      },
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

    // Registrar en audit
    await prisma.auditLog.create({
      data: {
        action: 'ORDER_READY',
        entityType: 'Order',
        entityId: id,
        userId: staffId,
        orderId: id,
      },
    });

    return this.mapOrderToDTO(updated);
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
      items: order.items.map((item: any) => this.mapOrderItemToDTO(item)),
      acceptedBy: order.acceptedBy
        ? {
            id: order.acceptedBy.id,
            email: order.acceptedBy.email,
            name: order.acceptedBy.name,
            role: order.acceptedBy.role,
            isActive: order.acceptedBy.isActive,
            createdAt: order.acceptedBy.createdAt,
          }
        : undefined,
      acceptedAt: order.acceptedAt,
      readyAt: order.readyAt,
      completedAt: order.completedAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  /**
   * Mapear item de orden a DTO
   */
  private mapOrderItemToDTO(item: any): OrderItemDTO {
    return {
      id: item.id,
      productId: item.productId,
      product: {
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price.toString(),
        imageUrl: item.product.imageUrl,
        stock: item.product.stock,
        available: item.product.available,
        category: {
          id: item.product.category.id,
          name: item.product.category.name,
          description: item.product.category.description,
          icon: item.product.category.icon,
          displayOrder: item.product.category.displayOrder,
        },
        createdAt: item.product.createdAt,
      },
      quantity: item.quantity,
      unitPrice: item.unitPrice.toString(),
      subtotal: item.subtotal.toString(),
    };
  }
}

export const orderService = new OrderService();
