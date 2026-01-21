import React from 'react';
import type { Order } from '../types/index';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, Trash2 } from 'lucide-react';

interface OrderTableProps {
  orders: Order[];
  isLoading?: boolean;
  onView: (order: Order) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<Order['status'], string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  READY: 'bg-green-100 text-green-800',
  DELIVERED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  isLoading,
  onView,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No hay órdenes para mostrar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 text-left font-semibold text-gray-700">ID</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700">Cliente</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700">Items</th>
            <th className="px-6 py-3 text-right font-semibold text-gray-700">Total</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700">Estado</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700">Fecha</th>
            <th className="px-6 py-3 text-center font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-4 font-mono text-xs">{order.id.slice(0, 8)}</td>
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{order.user?.name || 'N/A'}</div>
                <div className="text-xs text-gray-500">{order.user?.email}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-gray-700">{order.items.length} items</div>
              </td>
              <td className="px-6 py-4 text-right font-semibold">
                ${order.total.toFixed(2)}
              </td>
              <td className="px-6 py-4">
                <span className={`badge ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 text-xs text-gray-600">
                {formatDistanceToNow(new Date(order.createdAt), {
                  addSuffix: true,
                  locale: es,
                })}
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onView(order)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Ver detalles"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(order.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
