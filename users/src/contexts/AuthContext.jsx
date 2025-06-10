import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { getMe } from '../api/userApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const syncUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        const res = await getMe();
        const userData = res.data;
        const fullUserData = {
          _id: userData._id,
          username: userData.username,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          role: userData.role,
          avatarUrl: userData.avatarUrl
        };
        syncUser(fullUserData);
      } catch (err) {
        setError(err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const value = useMemo(() => ({
    user,
    setUser: syncUser,
    loading,
    error,
    logout,
    isAuthenticated: !!user
  }), [user, loading, error]);

  return (
    <AuthContext.Provider value={value}>
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