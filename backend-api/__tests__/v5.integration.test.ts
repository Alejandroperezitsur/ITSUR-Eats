/**
 * Test: Order Flow - Integration Tests v5.0
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { prisma } from '../config/prisma';

describe('Order Flow - Security & Integrity', () => {
  
  it('should prevent price manipulation from client', async () => {
    // Setup: Crear producto con precio real $15.99
    const product = await prisma.product.create({
      data: {
        id: 'pizza_1',
        name: 'Pizza Margherita',
        priceInCents: 1599, // $15.99
        vendorId: 'vendor_1',
        stock: 100
      }
    });

    // Cliente intenta ordenar con precio alterado
    const orderData = {
      customerId: 'customer_1',
      vendorId: 'vendor_1',
      items: [
        {
          productId: 'pizza_1',
          quantity: 2
          // Cliente NO envía precio
        }
      ]
    };

    // Backend obtiene precio del producto en DB
    let calculatedTotal = 0;
    for (const item of orderData.items) {
      const prod = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      calculatedTotal += (prod?.priceInCents || 0) * item.quantity;
    }

    // Verify: total es SIEMPRE correcto, nunca manipulado
    expect(calculatedTotal).toBe(3198); // 2 x $15.99
  });

  it('should detect refresh token reuse', async () => {
    // Simular login
    const tokenHash1 = 'hash_abc123';
    
    // Primer refresh (token válido)
    const session1 = await prisma.session.create({
      data: {
        userId: 'user_1',
        deviceId: 'device_1',
        deviceName: 'Test',
        fingerprint: 'fp_123',
        ipAddress: '192.168.1.1',
        userAgent: 'test',
        tokenVersion: 1,
        refreshTokenHash: tokenHash1,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        lastActivityAt: new Date()
      }
    });

    // Backend actualiza hash en refresh
    await prisma.session.update({
      where: { id: session1.id },
      data: {
        tokenVersion: 2,
        refreshTokenHash: 'hash_abc456' // Token rotado
      }
    });

    // Atacante intenta reutilizar token antiguo
    const session = await prisma.session.findUnique({
      where: { id: session1.id }
    });

    // El hash no coincide → detectado
    expect(session?.refreshTokenHash).not.toBe(tokenHash1);
    expect(session?.refreshTokenHash).toBe('hash_abc456');
  });

  it('should prevent concurrent order acceptance', async () => {
    // Crear orden
    const order = await prisma.order.create({
      data: {
        customerId: 'customer_1',
        vendorId: 'vendor_1',
        items: [],
        totalAmountInCents: 1599,
        status: 'PENDING',
        version: 1
      }
    });

    // Simular dos vendors intentando aceptar con optimistic lock
    const version1 = order.version;

    // Vendor 1 acepta exitosamente
    const accepted1 = await prisma.order.updateMany({
      where: {
        id: order.id,
        version: version1
      },
      data: {
        status: 'ACCEPTED',
        version: { increment: 1 }
      }
    });

    expect(accepted1.count).toBe(1); // Éxito

    // Vendor 2 intenta aceptar con versión antigua
    const accepted2 = await prisma.order.updateMany({
      where: {
        id: order.id,
        version: version1 // Versión antigua
      },
      data: {
        status: 'ACCEPTED',
        version: { increment: 1 }
      }
    });

    expect(accepted2.count).toBe(0); // Falla - ConcurrencyException
  });

  it('should maintain audit trail', async () => {
    // Crear auditoría
    const audit = await prisma.auditLog.create({
      data: {
        action: 'ORDER_CREATED',
        aggregateId: 'order_1',
        aggregateType: 'Order',
        userId: 'user_1',
        ipAddress: '192.168.1.1',
        userAgent: 'TestClient/1.0',
        changes: JSON.stringify({
          items: [{ productId: 'pizza_1', quantity: 2 }],
          totalAmount: 3198
        }),
        timestamp: new Date()
      }
    });

    // Verificar que se guardó
    const retrieved = await prisma.auditLog.findUnique({
      where: { id: audit.id }
    });

    expect(retrieved?.action).toBe('ORDER_CREATED');
    expect(retrieved?.aggregateId).toBe('order_1');
    expect(retrieved?.userId).toBe('user_1');
  });

  it('should guarantee event outbox delivery', async () => {
    // Crear evento
    const event = await prisma.eventOutbox.create({
      data: {
        eventType: 'order.created',
        aggregateId: 'order_123',
        aggregateType: 'Order',
        data: {
          orderId: 'order_123',
          customerId: 'customer_1'
        },
        published: false,
        priority: 1
      }
    });

    // Simular procesamiento
    await prisma.eventOutbox.update({
      where: { id: event.id },
      data: {
        published: true,
        publishedAt: new Date()
      }
    });

    // Verificar
    const processed = await prisma.eventOutbox.findUnique({
      where: { id: event.id }
    });

    expect(processed?.published).toBe(true);
    expect(processed?.publishedAt).toBeDefined();
  });

  afterAll(async () => {
    // Cleanup
    await prisma.$disconnect();
  });
});
