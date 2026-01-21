import { Request, Response } from 'express';
import { productService } from '@services/product.service';

export class ProductController {
  /**
   * GET /categories
   */
  async getCategories(_req: Request, res: Response): Promise<void> {
    try {
      const categories = await productService.getCategories();

      res.status(200).json({
        success: true,
        data: categories,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch categories';
      res.status(500).json({
        success: false,
        error: { message, code: 'FETCH_CATEGORIES_ERROR' },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /products
   */
  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const categoryId = req.query.categoryId as string;
      const search = req.query.search as string;

      const result = await productService.getProducts(page, limit, categoryId, search);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch products';
      res.status(500).json({
        success: false,
        error: { message, code: 'FETCH_PRODUCTS_ERROR' },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /products/:id
   */
  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const product = await productService.getProductById(id);

      if (!product) {
        res.status(404).json({
          success: false,
          error: { message: 'Product not found', code: 'NOT_FOUND' },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch product';
      res.status(500).json({
        success: false,
        error: { message, code: 'FETCH_PRODUCT_ERROR' },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /products
   */
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({
        success: true,
        data: product,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create product';
      res.status(500).json({
        success: false,
        error: { message, code: 'CREATE_PRODUCT_ERROR' },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * PATCH /products/:id
   */
  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await productService.updateProduct(id, req.body);
      res.status(200).json({
        success: true,
        data: product,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update product';
      res.status(500).json({
        success: false,
        error: { message, code: 'UPDATE_PRODUCT_ERROR' },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * DELETE /products/:id
   */
  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);
      res.status(200).json({
        success: true,
        data: { message: 'Product deleted successfully' },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete product';
      res.status(500).json({
        success: false,
        error: { message, code: 'DELETE_PRODUCT_ERROR' },
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export const productController = new ProductController();
