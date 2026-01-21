import { Request, Response } from 'express';
import { orderService } from '@services/order.service';

export class OrderController {
  /**
   * POST /orders
   */
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: { message: 'Unauthorized', code: 'UNAUTHORIZED' },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { items, notes } = req.body;

      const order = await orderService.createOrder(req.user.id, {
        items,
        notes,
      });

      res.status(201).json({
        success: true,
        data: order,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create order';
      res.status(400).json({
        success: false,
        error: { message, code: 'CREATE_ORDER_ERROR' },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /orders
   */
  async getOrders(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: { message: 'Unauthorized', code: 'UNAUTHORIZED' },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await orderService.getUserOrders(req.user.id, page, limit);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch orders';
      res.status(500).json({
        success: false,
        error: { message, code: 'FETCH_ORDERS_ERROR' },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /orders/:id
   */
  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const order = await orderService.getOrderById(id);

      if (!order) {
        res.status(404).json({
          success: false,
          error: { message: 'Order not found', code: 'NOT_FOUND' },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: order,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch order';
      res.status(500).json({
        success: false,
        error: { message, code: 'FETCH_ORDER_ERROR' },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * PUT /orders/:id/cancel
   */
  async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: { message: 'Unauthorized', code: 'UNAUTHORIZED' },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { id } = req.params;

      const order = await orderService.cancelOrder(id, req.user.id);

      res.status(200).json({
        success: true,
        data: order,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to cancel order';
      res.status(400).json({
        success: false,
        error: { message, code: 'CANCEL_ORDER_ERROR' },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * PUT /orders/:id/accept (Staff only)
   */
  async acceptOrder(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: { message: 'Unauthorized', code: 'UNAUTHORIZED' },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { id } = req.params;

      const order = await orderService.acceptOrder(id, req.user.id);

      res.status(200).json({
        success: true,
        data: order,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to accept order';
      res.status(400).json({
        success: false,
        error: { message, code: 'ACCEPT_ORDER_ERROR' },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * PUT /orders/:id/ready (Staff only)
   */
  async markOrderReady(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: { message: 'Unauthorized', code: 'UNAUTHORIZED' },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { id } = req.params;

      const order = await orderService.markOrderReady(id, req.user.id);

      res.status(200).json({
        success: true,
        data: order,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to mark order ready';
      res.status(400).json({
        success: false,
        error: { message, code: 'MARK_READY_ERROR' },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * PUT /orders/:id/complete (Staff only)
   */
  async completeOrder(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: { message: 'Unauthorized', code: 'UNAUTHORIZED' },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { id } = req.params;

      const order = await orderService.completeOrder(id, req.user.id);

      res.status(200).json({
        success: true,
        data: order,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to complete order';
      res.status(400).json({
        success: false,
        error: { message, code: 'COMPLETE_ORDER_ERROR' },
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export const orderController = new OrderController();
