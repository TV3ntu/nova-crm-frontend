import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [token, setToken] = useState(localStorage.getItem('nova_crm_token'));

  // Check if user is authenticated on app load (mock version)
  useEffect(() => {
    const checkAuth = () => {
      if (token) {
        // Mock user data
        setUser({
          id: 1,
          name: 'Admin NOVA',
          email: 'admin@novadance.com',
          role: 'admin',
          avatar: null
        });
      }
      setLoading(false);
    };

    // Simulate a small delay to show loading state
    setTimeout(checkAuth, 500);
  }, [token]);

  const login = async (email, password) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login for any credentials
      if (email && password) {
        const mockToken = 'mock_jwt_token_' + Date.now();
        const mockUser = {
          id: 1,
          name: 'Admin NOVA',
          email: email,
          role: 'admin',
          avatar: null
        };
        
        localStorage.setItem('nova_crm_token', mockToken);
        setToken(mockToken);
        setUser(mockUser);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: 'Email y contraseña son requeridos' 
        };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: 'Error de inicio de sesión' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('nova_crm_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
