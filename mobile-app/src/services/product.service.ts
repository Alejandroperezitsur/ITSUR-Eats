import { apiClient } from './api';
import { Product, Category, CreateOrderRequest, Order, PaginatedResponse } from '@types/index';

export class ProductService {
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.instance.get('/products/categories');
    return response.data.data;
  }

  async getProducts(page = 1, limit = 10, categoryId?: string, search?: string) {
    const params: any = { page, limit };
    if (categoryId) params.categoryId = categoryId;
    if (search) params.search = search;

    const response = await apiClient.instance.get('/products', { params });
    return response.data as PaginatedResponse<Product>;
  }

  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.instance.get(`/products/${id}`);
    return response.data.data;
  }
}

export class OrderService {
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.instance.post('/orders', data);
    return response.data.data;
  }

  async getUserOrders(page = 1, limit = 10) {
    const response = await apiClient.instance.get('/orders', {
      params: { page, limit },
    });
    return response.data as PaginatedResponse<Order>;
  }

  async getOrderById(id: string): Promise<Order> {
    const response = await apiClient.instance.get(`/orders/${id}`);
    return response.data.data;
  }

  async cancelOrder(id: string): Promise<Order> {
    const response = await apiClient.instance.put(`/orders/${id}/cancel`);
    return response.data.data;
  }
}

export const productService = new ProductService();
export const orderService = new OrderService();
