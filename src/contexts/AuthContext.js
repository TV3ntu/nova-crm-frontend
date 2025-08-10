import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay un token guardado al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('nova_crm_token');
      
      if (token) {
        try {
          // Intentar obtener información del usuario actual
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          // Si hay error, limpiar token inválido
          localStorage.removeItem('nova_crm_token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      
      const response = await authAPI.login({ username, password });
      const { token, user: userData } = response.data;
      
      // Guardar token en localStorage
      localStorage.setItem('nova_crm_token', token);
      
      // Actualizar estado
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Error en login:', error);
      
      // Limpiar estado en caso de error
      localStorage.removeItem('nova_crm_token');
      setUser(null);
      setIsAuthenticated(false);
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error de autenticación' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Intentar hacer logout en el servidor
      await authAPI.logout();
    } catch (error) {
      console.error('Error en logout:', error);
      // Continuar con logout local aunque falle el servidor
    } finally {
      // Limpiar estado local
      localStorage.removeItem('nova_crm_token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
