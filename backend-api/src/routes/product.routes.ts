import { Router } from 'express';
import { productController } from '@controllers/product.controller';
import { authenticateJWT } from '@middleware/auth';
import { validateQuery, validateParams, commonSchemas } from '@middleware/validation';
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

export default router;
