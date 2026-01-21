// Auth
export interface AuthResponse {
  user: User;
  accessToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'CAFETERIA_STAFF' | 'ADMIN';
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

// Product
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  displayOrder: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  imageUrl?: string;
  stock: number;
  available: boolean;
  category: Category;
  createdAt: string;
}

// Order
export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  notes?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: string;
  subtotal: string;
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PAID' | 'ACCEPTED' | 'READY' | 'COMPLETED' | 'CANCELLED';
  total: string;
  notes?: string;
  items: OrderItem[];
  acceptedBy?: User;
  acceptedAt?: string;
  readyAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
