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

  const verifyLoginOtp = async (email, otp) => {
    const data = await authApi.verifyLoginOtp({ email, otp });
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

  const sendRegisterOtp = async (email, name) => {
    return await authApi.sendRegisterOtp({ email, name });
  };

  const resendLoginOtp = async (email) => {
    return await authApi.resendLoginOtp({ email });
  };

  const register = async (userData) => {
    const data = await authApi.register(userData);
    if (data.token) {
      localStorage.setItem('smartbill_token', data.token);
      setToken(data.token);
      const userProfile = {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: 'USER',
      };
      localStorage.setItem('smartbill_user', JSON.stringify(userProfile));
      setUser(userProfile);
      authApi.getProfile().then((full) => {
        setUser(full);
        localStorage.setItem('smartbill_user', JSON.stringify(full));
      }).catch(() => {});
    }
    return data;
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
        verifyLoginOtp,
        sendRegisterOtp,
        resendLoginOtp,
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
