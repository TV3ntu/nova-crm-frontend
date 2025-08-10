import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
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
          // Verificar si el token es válido
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
          setIsAuthenticated(true);
          console.log('Sesión restaurada exitosamente');
        } catch (error) {
          console.warn('Error al verificar autenticación:', error);
          
          // Solo limpiar si es claramente un error de token inválido
          const errorMessage = error.response?.data?.message || error.message || '';
          const isTokenError = error.response?.status === 401 && 
                              (errorMessage.includes('expired') || 
                               errorMessage.includes('invalid') || 
                               errorMessage.includes('token'));
          
          if (isTokenError) {
            console.log('Token inválido, limpiando sesión');
            localStorage.removeItem('nova_crm_token');
            setUser(null);
            setIsAuthenticated(false);
          } else {
            // Para errores de red u otros, mantener la sesión
            console.log('Error de red, manteniendo sesión local');
            setIsAuthenticated(true);
            // Usar datos básicos del token si están disponibles
            setUser({ username: 'admin' }); // Fallback básico
          }
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
      setUser(userData || { username });
      setIsAuthenticated(true);
      
      console.log('Login exitoso para:', username);
      
      return { success: true, user: userData || { username } };
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
      setLoading(true);
      
      // Intentar hacer logout en el servidor (no crítico si falla)
      try {
        await authAPI.logout();
        console.log('Logout en servidor exitoso');
      } catch (error) {
        console.warn('Error en logout del servidor (continuando):', error);
      }
      
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Siempre limpiar estado local
      localStorage.removeItem('nova_crm_token');
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      console.log('Logout local completado');
    }
  };

  // Función para verificar periódicamente la validez del token
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenValidity = async () => {
      try {
        await authAPI.getCurrentUser();
      } catch (error) {
        const errorMessage = error.response?.data?.message || '';
        const isTokenExpired = error.response?.status === 401 && 
                              (errorMessage.includes('expired') || 
                               errorMessage.includes('invalid') || 
                               errorMessage.includes('token'));
        
        if (isTokenExpired) {
          console.warn('Token expirado detectado en verificación periódica');
          localStorage.removeItem('nova_crm_token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    };

    // Verificar token cada 30 minutos (menos agresivo)
    const interval = setInterval(checkTokenValidity, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

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

export default AuthContext;
