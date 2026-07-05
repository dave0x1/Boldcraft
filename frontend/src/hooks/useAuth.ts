import { useState } from 'react';
import { login as apiLogin } from '../api';

export function useAuth() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  async function login(email: string, password: string) {
    const t = await apiLogin(email, password);
    localStorage.setItem('token', t);
    setToken(t);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
  }

  return { token, isOwner: !!token, login, logout };
}