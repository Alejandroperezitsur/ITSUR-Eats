// API Response types
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

// Auth types
export interface JwtPayload {
  id: string;
  email: string;
  role: 'STUDENT' | 'CAFETERIA_STAFF' | 'ADMIN';
  iat: number;
  exp: number;
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

// Auth requests
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// User DTO
export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'CAFETERIA_STAFF' | 'ADMIN';
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

// Product Requests
export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  stock?: number;
  available?: boolean;
  imageUrl?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  stock?: number;
  available?: boolean;
  imageUrl?: string;
}

// Product DTO
export interface ProductDTO {
  id: string;
  name: string;
  description?: string;
  price: string;
  imageUrl?: string;
  stock: number;
  available: boolean;
  category: CategoryDTO;
  createdAt: Date;
}

export interface CategoryDTO {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  displayOrder: number;
}

// Order DTOs
export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  notes?: string;
}

export interface OrderDTO {
  id: string;
  userId: string;
  status: 'PENDING' | 'PAID' | 'ACCEPTED' | 'READY' | 'COMPLETED' | 'CANCELLED';
  total: string;
  notes?: string;
  items: OrderItemDTO[];
  acceptedBy?: UserDTO;
  acceptedAt?: Date;
  readyAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemDTO {
  id: string;
  productId: string;
  product: ProductDTO;
  quantity: number;
  unitPrice: string;
  subtotal: string;
}

// Payment DTOs
export interface CreatePaymentRequest {
  orderId: string;
  method: 'CARD' | 'WALLET';
  stripeToken?: string;
}

export interface PaymentDTO {
  id: string;
  orderId: string;
  amount: string;
  method: 'CARD' | 'WALLET';
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
  stripeIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Request user
export interface RequestUser extends Omit<JwtPayload, 'iat' | 'exp'> {
  iat: number;
  exp: number;
}
