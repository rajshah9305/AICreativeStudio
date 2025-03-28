import { useEffect } from 'react';
import { useAuthStore } from '../store';
import { api } from '../services/api';

export const useAuth = () => {
  const { token, user, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  return { user, logout };
};
