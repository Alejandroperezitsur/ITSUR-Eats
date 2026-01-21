import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiResponse, PaginatedResponse } from '../types/index';
import { useAuthStore } from '../store/auth';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.client.interceptors.request.use((config) => {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshToken = useAuthStore.getState().refreshToken;
          if (refreshToken) {
            try {
              const response = await this.client.post('/auth/refresh', {
                refreshToken,
              });
              const { accessToken } = response.data;
              useAuthStore.getState().setTokens(accessToken, refreshToken);
              return this.client(originalRequest);
            } catch (err) {
              useAuthStore.getState().logout();
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.client.post<ApiResponse<any>>('/auth/login', {
      email,
      password,
    });
  }

  // Order endpoints
  async getOrders(
    page = 1,
    pageSize = 20,
    filters?: any
  ) {
    return this.client.get<ApiResponse<PaginatedResponse<any>>>(
      '/orders',
      { params: { page, pageSize, ...filters } }
    );
  }

  async getOrder(id: string) {
    return this.client.get<ApiResponse<any>>(`/orders/${id}`);
  }

  async updateOrder(id: string, data: any) {
    return this.client.patch<ApiResponse<any>>(`/orders/${id}`, data);
  }

  async cancelOrder(id: string) {
    return this.client.post<ApiResponse<any>>(`/orders/${id}/cancel`);
  }

  // Product endpoints
  async getProducts(page = 1, pageSize = 20, filters?: any) {
    return this.client.get<ApiResponse<PaginatedResponse<any>>>(
      '/products',
      { params: { page, pageSize, ...filters } }
    );
  }

  async getProduct(id: string) {
    return this.client.get<ApiResponse<any>>(`/products/${id}`);
  }

  async createProduct(data: any) {
    return this.client.post<ApiResponse<any>>('/products', data);
  }

  async updateProduct(id: string, data: any) {
    return this.client.patch<ApiResponse<any>>(`/products/${id}`, data);
  }

  async deleteProduct(id: string) {
    return this.client.delete<ApiResponse<any>>(`/products/${id}`);
  }

  async getCategories() {
    return this.client.get<ApiResponse<any[]>>('/products/categories');
  }

  // Analytics endpoints
  async getDashboard(period = '7d') {
    return this.client.get<ApiResponse<any>>('/analytics/dashboard', {
      params: { period },
    });
  }

  async getDailyRevenue(startDate: string, endDate: string) {
    return this.client.get<ApiResponse<any>>('/analytics/revenue', {
      params: { startDate, endDate },
    });
  }

  async getOrderStats(period = '30d') {
    return this.client.get<ApiResponse<any>>('/analytics/orders', {
      params: { period },
    });
  }
}

export const apiClient = new ApiClient();
