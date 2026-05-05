import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { authService } from '../services/api';

type Role = 'Admin' | 'Sales' | 'HR' | 'Project' | 'Finance';

interface User {
  id: number;
  username: string;
  email: string;
  role: { name: Role };
}

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: User | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(() => (localStorage.getItem('role') as Role) || 'Admin');
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (credentials: any) => {
    try {
      const response = await authService.login(credentials);
      const { access_token, user } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role.name);

      setUser(user);
      setRole(user.role.name);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null);
    setRole('Admin');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ role, setRole, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
