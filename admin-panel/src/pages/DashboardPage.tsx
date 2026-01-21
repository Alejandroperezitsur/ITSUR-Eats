import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiClient } from '../services/api';
import { TrendingUp, ShoppingCart, Package, DollarSign } from 'lucide-react';

interface DashboardData {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    pendingOrders: number;
  };
  chartData: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export const DashboardPage: React.FC = () => {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Datos de ejemplo mientras el backend no tenga analytics
        const mockData: DashboardData = {
          stats: {
            totalRevenue: 15420.50,
            totalOrders: 245,
            totalProducts: 18,
            pendingOrders: 12,
          },
          chartData: [
            { date: 'Lun', revenue: 1200, orders: 15 },
            { date: 'Mar', revenue: 1900, orders: 22 },
            { date: 'Mié', revenue: 1500, orders: 18 },
            { date: 'Jue', revenue: 2200, orders: 28 },
            { date: 'Vie', revenue: 2800, orders: 35 },
            { date: 'Sab', revenue: 3900, orders: 42 },
            { date: 'Dom', revenue: 2600, orders: 30 },
          ],
        };
        setData(mockData);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Resumen del estado de tu negocio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ${data?.stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Órdenes Totales</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {data?.stats.totalOrders}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Órdenes Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">
                {data?.stats.pendingOrders}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Productos</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {data?.stats.totalProducts}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ingresos por Día</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                dot={{ fill: '#2563eb' }}
                name="Ingresos ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Órdenes por Día</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="orders"
                fill="#10b981"
                name="Órdenes"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
