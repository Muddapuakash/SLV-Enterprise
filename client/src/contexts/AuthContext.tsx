import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { reconnectSocket, disconnectSocket } from '../services/socket';

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER' | 'TECHNICIAN';
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sv_access_token');
    if (token) {
      // Decode JWT to get user info (not for security — just display)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          setUser({ id: payload.userId, email: payload.email, role: payload.role });
          reconnectSocket(token);
        } else {
          localStorage.removeItem('sv_access_token');
        }
      } catch {
        localStorage.removeItem('sv_access_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { accessToken, refreshToken, user: userData } = res.data.data;
    localStorage.setItem('sv_access_token', accessToken);
    localStorage.setItem('sv_refresh_token', refreshToken);
    setUser(userData);
    reconnectSocket(accessToken);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('sv_refresh_token');
    try {
      if (refreshToken) await api.post('/api/auth/logout', { refreshToken });
    } catch { /* ignore */ }
    localStorage.removeItem('sv_access_token');
    localStorage.removeItem('sv_refresh_token');
    setUser(null);
    disconnectSocket();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
