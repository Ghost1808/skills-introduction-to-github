'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { authService } from '@/services/auth';
import { AuthContextType, User, RegisterData } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth data on mount
    const storedToken = localStorage.getItem('clinic_token');
    const storedUser = localStorage.getItem('clinic_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('clinic_token');
        localStorage.removeItem('clinic_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        const { user: userData, token: userToken } = response.data;
        
        setUser(userData);
        setToken(userToken);
        
        localStorage.setItem('clinic_token', userToken);
        localStorage.setItem('clinic_user', JSON.stringify(userData));
        
        toast.success(response.message || 'Inicio de sesión exitoso');
      } else {
        throw new Error(response.message || 'Error en el inicio de sesión');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      if (response.success && response.data) {
        const { user: newUser, token: userToken } = response.data;
        
        setUser(newUser);
        setToken(userToken);
        
        localStorage.setItem('clinic_token', userToken);
        localStorage.setItem('clinic_user', JSON.stringify(newUser));
        
        toast.success(response.message || 'Registro exitoso');
      } else {
        throw new Error(response.message || 'Error en el registro');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    authService.logout();
    toast.info('Sesión cerrada');
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.updateProfile(data);
      
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('clinic_user', JSON.stringify(response.data));
        toast.success(response.message || 'Perfil actualizado exitosamente');
      } else {
        throw new Error(response.message || 'Error al actualizar el perfil');
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    updateProfile,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};