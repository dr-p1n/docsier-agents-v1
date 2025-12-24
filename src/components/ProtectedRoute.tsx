import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <div className="text-center">
          <p className="text-xl text-gray-700 mb-2">Redirigiendo al inicio de sesión...</p>
          <p className="text-sm text-gray-600">
            Si no se redirige automáticamente,{' '}
            <a 
              href={import.meta.env.VITE_WEBSITE_URL || 'https://0498855a-55c7-4994-b872-d69718b4f3ca.lovableproject.com'} 
              className="text-indigo-600 underline"
            >
              haz clic aquí
            </a>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
