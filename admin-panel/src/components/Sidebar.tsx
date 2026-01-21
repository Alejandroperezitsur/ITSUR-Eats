import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  ShoppingCart,
  Package,
  Settings,
  ChevronDown,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

const items: SidebarItem[] = [
  { label: 'Dashboard', path: '/', icon: <BarChart3 size={20} /> },
  { label: 'Órdenes', path: '/orders', icon: <ShoppingCart size={20} /> },
  { label: 'Productos', path: '/products', icon: <Package size={20} /> },
  { label: 'Configuración', path: '/settings', icon: <Settings size={20} /> },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-white border-r border-gray-200 min-h-screen`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        {isOpen && <h1 className="font-bold text-lg">Menu</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronDown
            size={20}
            className={`transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`}
          />
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            title={!isOpen ? item.label : ''}
          >
            {item.icon}
            {isOpen && (
              <span className="flex-1">
                {item.label}
                {item.badge && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};
