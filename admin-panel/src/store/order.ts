import { create } from 'zustand';
import type { Order, OrderFilter } from '../types/index';

interface OrderStore {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  total: number;
  page: number;
  pageSize: number;
  filters: OrderFilter;
  
  setOrders: (orders: Order[]) => void;
  setSelectedOrder: (order: Order | null) => void;
  setLoading: (isLoading: boolean) => void;
  setTotal: (total: number) => void;
  setPage: (page: number) => void;
  setFilters: (filters: OrderFilter) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  removeOrder: (id: string) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  selectedOrder: null,
  isLoading: false,
  total: 0,
  page: 1,
  pageSize: 20,
  filters: {},

  setOrders: (orders) => set({ orders }),
  setSelectedOrder: (selectedOrder) => set({ selectedOrder }),
  setLoading: (isLoading) => set({ isLoading }),
  setTotal: (total) => set({ total }),
  setPage: (page) => set({ page }),

  setFilters: (filters) => set({ filters }),

  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
      total: state.total + 1,
    })),

  updateOrder: (id, updates) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
      selectedOrder: state.selectedOrder?.id === id
        ? { ...state.selectedOrder, ...updates }
        : state.selectedOrder,
    })),

  removeOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((o) => o.id !== id),
      total: state.total - 1,
    })),
}));
