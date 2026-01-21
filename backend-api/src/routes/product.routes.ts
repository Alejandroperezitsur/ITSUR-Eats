import { Router } from 'express';
import { productController } from '@controllers/product.controller';
import { authenticateJWT, authorize } from '@middleware/auth';
import { auditMiddleware } from '@middleware/audit';
import { AuditAction } from '@prisma/client';
import { validateQuery, validateParams, validateBody, commonSchemas } from '@middleware/validation';
import Joi from 'joi';

const router = Router();

// Get categories
router.get('/categories', (req, res) => productController.getCategories(req, res));

// Get products with pagination
router.get(
  '/',
  validateQuery(
    Joi.object({
      page: commonSchemas.pagination.page,
      limit: commonSchemas.pagination.limit,
      categoryId: Joi.string().uuid().optional(),
      search: Joi.string().max(50).optional(),
    })
  ),
  (req, res) => productController.getProducts(req, res)
);

// Get product by ID
router.get(
  '/:id',
  validateParams(Joi.object({ id: commonSchemas.uuid })),
  (req, res) => productController.getProductById(req, res)
);

// Create Product (Protected)
router.post(
  '/',
  authenticateJWT,
  authorize('ADMIN', 'CAFETERIA_STAFF'),
  validateBody(
    Joi.object({
      name: Joi.string().required(),
      price: Joi.number().min(0).required(),
      categoryId: commonSchemas.uuid.required(),
      description: Joi.string().optional(),
      stock: Joi.number().integer().min(0).optional(),
      imageUrl: Joi.string().uri().optional(),
      available: Joi.boolean().optional()
    })
  ),
  auditMiddleware(AuditAction.CREATE, 'Product'),
  (req, res) => productController.createProduct(req, res)
);

// Update Product (Protected)
router.patch(
  '/:id',
  authenticateJWT,
  authorize('ADMIN', 'CAFETERIA_STAFF'),
  validateParams(Joi.object({ id: commonSchemas.uuid })),
  validateBody(
    Joi.object({
      name: Joi.string().optional(),
      price: Joi.number().min(0).optional(),
      categoryId: commonSchemas.uuid.optional(),
      description: Joi.string().optional(),
      stock: Joi.number().integer().min(0).optional(),
      imageUrl: Joi.string().uri().optional(),
      available: Joi.boolean().optional()
    })
  ),
  auditMiddleware(AuditAction.UPDATE, 'Product'),
  (req, res) => productController.updateProduct(req, res)
);

// Delete Product (Protected)
router.delete(
  '/:id',
  authenticateJWT,
  authorize('ADMIN'),
  validateParams(Joi.object({ id: commonSchemas.uuid })),
  auditMiddleware(AuditAction.DELETE, 'Product'),
  (req, res) => productController.deleteProduct(req, res)
);

export default router;
