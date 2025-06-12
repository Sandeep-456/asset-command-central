
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getCurrentUser()
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const { user: userData, token } = await authService.login(credentials);
    localStorage.setItem('token', token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasBaseAccess = (baseId) => {
    if (user?.role === 'Admin') return true;
    if (user?.role === 'Base Commander') return user?.assignedBase === baseId;
    return true; // Logistics officers have access to all bases for transfers
  };

  const value = {
    user,
    login,
    logout,
    hasRole,
    hasBaseAccess,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
