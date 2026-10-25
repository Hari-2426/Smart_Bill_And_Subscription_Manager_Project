import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smartbill_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('smartbill_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Load and refresh user profile if token exists
  const loadProfile = useCallback(async () => {
    if (!localStorage.getItem('smartbill_token')) {
      setIsLoading(false);
      return;
    }
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
      localStorage.setItem('smartbill_user', JSON.stringify(profile));
    } catch (err) {
      console.warn('Profile load failed or token expired:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    if (data.token) {
      localStorage.setItem('smartbill_token', data.token);
      setToken(data.token);
      const userProfile = {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
      };
      localStorage.setItem('smartbill_user', JSON.stringify(userProfile));
      setUser(userProfile);
      // Fetch full profile details asynchronously
      authApi.getProfile().then((full) => {
        setUser(full);
        localStorage.setItem('smartbill_user', JSON.stringify(full));
      }).catch(() => {});
    }
    return data;
  };

  const register = async (userData) => {
    return await authApi.register(userData);
  };

  const logout = () => {
    localStorage.removeItem('smartbill_token');
    localStorage.removeItem('smartbill_user');
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const fresh = await authApi.getProfile();
      setUser(fresh);
      localStorage.setItem('smartbill_user', JSON.stringify(fresh));
      return fresh;
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
