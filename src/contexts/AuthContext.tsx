import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || 'https://0498855a-55c7-4994-b872-d69718b4f3ca.lovableproject.com';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    authenticateUser();
  }, []);

  const authenticateUser = async () => {
    // Check if token is in URL (coming from website)
    const tokenFromURL = searchParams.get('token');

    if (tokenFromURL) {
      try {
        // Set the session with the token
        const { error } = await supabase.auth.setSession({
          access_token: tokenFromURL,
          refresh_token: tokenFromURL,
        });

        if (error) {
          console.error('Session error:', error);
          throw error;
        }

        // Clean up URL
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Authentication failed:', error);
        toast.error('Error de autenticación');
        redirectToLogin();
        return;
      }
    }

    // Check for existing session
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        redirectToLogin();
        return;
      }

      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.full_name || authUser.email || 'User',
        });
      } else {
        redirectToLogin();
      }
    } catch (error) {
      console.error('Auth error:', error);
      redirectToLogin();
    } finally {
      setLoading(false);
    }
  };

  const redirectToLogin = () => {
    if (WEBSITE_URL) {
      window.location.href = `${WEBSITE_URL}/auth`;
    } else {
      console.error('VITE_WEBSITE_URL not configured');
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success('Sesión cerrada');
    if (WEBSITE_URL) {
      window.location.href = WEBSITE_URL;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
