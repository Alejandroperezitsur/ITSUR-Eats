import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { useAuthStore } from '../store/auth';
import { AlertCircle, Loader } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = React.useState('admin@itsur.edu.mx');
  const [password, setPassword] = React.useState('AdminPassword123!');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser, setTokens } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.login(email, password);
      if (response.data.data) {
        const { accessToken, refreshToken, user } = response.data.data;
        setUser(user);
        setTokens(accessToken, refreshToken);
        navigate('/');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Error al iniciar sesión. Verifique sus credenciales.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🍽️</div>
          <h1 className="text-3xl font-bold text-gray-900">ITSUR Eats</h1>
          <p className="text-gray-600 mt-2">Panel de Administración</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="admin@itsur.edu.mx"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
          <p className="font-medium mb-2">📝 Credenciales de Demo:</p>
          <p>Email: admin@itsur.edu.mx</p>
          <p>Password: AdminPassword123!</p>
        </div>
      </div>
    </div>
  );
};
