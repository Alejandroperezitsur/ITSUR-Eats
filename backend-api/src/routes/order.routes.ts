import { Router } from 'express';
import { orderController } from '@controllers/order.controller';
import { authenticateJWT, authorize } from '@middleware/auth';
import { validateBody, validateParams, validateQuery, commonSchemas } from '@middleware/validation';
import Joi from 'joi';

const router = Router();

// All order routes require authentication
router.use(authenticateJWT);

// Create order
router.post(
  '/',
  validateBody(
    Joi.object({
      items: Joi.array()
        .items(
          Joi.object({
            productId: commonSchemas.uuid,
            quantity: Joi.number().integer().min(1).required(),
          })
        )
        .min(1)
        .required(),
      notes: Joi.string().max(500).optional(),
    })
  ),
  (req, res) => orderController.createOrder(req, res)
);

// Get user's orders
router.get(
  '/',
  validateQuery(
    Joi.object({
      page: commonSchemas.pagination.page,
      limit: commonSchemas.pagination.limit,
    })
  ),
  (req, res) => orderController.getOrders(req, res)
);

// Get order by ID
router.get(
  '/:id',
  validateParams(Joi.object({ id: commonSchemas.uuid })),
  (req, res) => orderController.getOrderById(req, res)
);

// Cancel order
router.put(
  '/:id/cancel',
  validateParams(Joi.object({ id: commonSchemas.uuid })),
  (req, res) => orderController.cancelOrder(req, res)
);

// Accept order (staff only)
router.put(
  '/:id/accept',
  authorize('CAFETERIA_STAFF', 'ADMIN'),
  validateParams(Joi.object({ id: commonSchemas.uuid })),
  (req, res) => orderController.acceptOrder(req, res)
);

// Mark order as ready (staff only)
router.put(
  '/:id/ready',
  authorize('CAFETERIA_STAFF', 'ADMIN'),
  validateParams(Joi.object({ id: commonSchemas.uuid })),
  (req, res) => orderController.markOrderReady(req, res)
);

export default router;
