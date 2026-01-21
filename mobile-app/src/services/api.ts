import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const API_VERSION = process.env.EXPO_PUBLIC_API_VERSION || 'v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api/${API_VERSION}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor: agregar token a requests
    this.client.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor: manejar 401 (token expirado)
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expirado, intentar refresh
          const refreshToken = await AsyncStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const response = await this.client.post('/auth/refresh');
              const { accessToken } = response.data.data;
              await AsyncStorage.setItem('accessToken', accessToken);
              // Reintentar request original
              return this.client(error.config);
            } catch {
              // Refresh falló, logout
              await AsyncStorage.removeItem('accessToken');
              await AsyncStorage.removeItem('refreshToken');
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  get instance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();
