import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types/inventory';
import { mockUser, mockUsers } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;
  updateUserById: (id: string, updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const login = (email: string, password: string) => {
    if (email && password.length >= 4) {
      // Find user by email or default to admin
      const found = users.find(u => u.email === email);
      setUser(found || mockUser);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);
  const isAdmin = user?.role === 'admin';

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
    if (user) {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...updates } : u));
    }
  };

  const addUser = (newUser: Omit<User, 'id'>) => {
    const created: User = { ...newUser, id: Date.now().toString() };
    setUsers(prev => [...prev, created]);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const updateUserById = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  return (
    <AuthContext.Provider value={{ user, users, isAuthenticated: !!user, isAdmin, login, logout, updateUser, addUser, deleteUser, updateUserById }}>
      {children}
    </AuthContext.Provider>
  );
};
