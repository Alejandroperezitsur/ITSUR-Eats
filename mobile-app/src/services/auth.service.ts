import { apiClient } from './api';
import { AuthResponse, User } from '@types/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthService {
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await apiClient.instance.post('/auth/register', {
      email,
      password,
      name,
    });
    const data = response.data.data;

    // Guardar tokens
    await AsyncStorage.setItem('accessToken', data.accessToken);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));

    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.instance.post('/auth/login', {
      email,
      password,
    });
    const data = response.data.data;

    // Guardar tokens
    await AsyncStorage.setItem('accessToken', data.accessToken);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));

    return data;
  }

  async logout(): Promise<void> {
    await apiClient.instance.post('/auth/logout');
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('user');
  }

  async getMe(): Promise<User> {
    const response = await apiClient.instance.get('/auth/me');
    return response.data.data;
  }

  async getStoredUser(): Promise<User | null> {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export const authService = new AuthService();
