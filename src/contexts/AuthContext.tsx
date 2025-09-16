import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  role: 'visitor' | 'participant' | 'organizer' | 'admin';
  fullName: string;
  department?: string;
  enrollmentNo?: string;
  mobile?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: string[]) => boolean;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: string;
  department?: string;
  enrollmentNo?: string;
  mobile?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// axios instance
const API = axios.create({
  baseURL: 'REACT_APP_API_URL=https://mlrmortexbackend.vercel.app/api'
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await API.post<User>('/users/login', { email, password });
      setUser(res.data);
      localStorage.setItem('currentUser', JSON.stringify(res.data));
      localStorage.setItem('token', res.data.token || '');
      return true;
    } catch (err: any) {
      console.error('login error', err.response?.data || err.message);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const res = await API.post<User>('/users/register', userData);
      setUser(res.data);
      localStorage.setItem('currentUser', JSON.stringify(res.data));
      localStorage.setItem('token', res.data.token || '');
      return true;
    } catch (err: any) {
      console.error('register error', err.response?.data || err.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  const hasRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
