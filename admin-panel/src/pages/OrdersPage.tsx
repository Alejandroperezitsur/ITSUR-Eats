import React from 'react';
import { apiClient } from '../services/api';
import { useOrderStore } from '../store/order';
import { OrderTable } from '../components/OrderTable';
import { Plus, Filter } from 'lucide-react';
import type { Order } from '../types/index';

export const OrdersPage: React.FC = () => {
  const { orders, setOrders, setLoading, selectedOrder, setSelectedOrder } = useOrderStore();
  const [isLoading, setIsLoading] = React.useState(true);
  const [filters, setFilters] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // Datos de ejemplo mientras se integra con backend
        const mockOrders: Order[] = [
          {
            id: '1',
            userId: 'user1',
            total: 45.99,
            status: 'PENDING',
            items: [
              {
                id: '1',
                productId: 'p1',
                productName: 'Cappuccino',
                quantity: 2,
                unitPrice: 4.00,
                subtotal: 8.00,
              },
            ],
            notes: 'Sin azúcar',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: {
              id: 'user1',
              name: 'Juan Pérez',
              email: 'juan@example.com',
            },
          },
        ];
        setOrders(mockOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [setOrders]);

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    // Aquí se abriría un modal o se navegaría a detalles
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro que desea eliminar esta orden?')) {
      try {
        await apiClient.cancelOrder(id);
        setOrders(orders.filter((o) => o.id !== id));
      } catch (err) {
        console.error('Error deleting order:', err);
      }
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Órdenes</h1>
          <p className="text-gray-600 mt-2">Gestiona todas las órdenes de pedidos</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nueva Orden
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <Filter size={20} className="text-gray-600" />
          <input
            type="text"
            placeholder="Buscar por ID o cliente..."
            className="input-field flex-1 min-w-64"
          />
          <select className="input-field flex-1 min-w-48">
            <option value="">Todos los estados</option>
            <option value="PENDING">Pendiente</option>
            <option value="CONFIRMED">Confirmada</option>
            <option value="PREPARING">Preparando</option>
            <option value="READY">Lista</option>
            <option value="DELIVERED">Entregada</option>
            <option value="CANCELLED">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <OrderTable
          orders={orders}
          isLoading={isLoading}
          onView={handleView}
          onDelete={handleDelete}
        />
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Total: {orders.length} órdenes
        </p>
        <div className="flex gap-2">
          <button className="btn-secondary px-3">Anterior</button>
          <button className="btn-secondary px-3">Siguiente</button>
        </div>
      </div>
    </div>
  );
};
