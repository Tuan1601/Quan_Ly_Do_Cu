import React, { createContext, useState, useContext, useEffect } from 'react';
import * as userApi from '../api/userApi';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Đăng nhập
  const login = async (email, password) => {
    try {
      const res = await userApi.login(email, password);
      // API trả về trực tiếp object chứa user info và token
      const userData = res; // Không cần .data vì response trả về trực tiếp
      setToken(userData.token);
      setCurrentUser({
        _id: userData._id,
        username: userData.username,
        email: userData.email,
        role: userData.role
      });
      localStorage.setItem('token', userData.token);
      console.log('Login success:', userData); // Debug log
      return userData;
    } catch (error) {
      console.log('Login error:', error); // Debug log
      setCurrentUser(null);
      setToken('');
      localStorage.removeItem('token');
      throw error;
    }
  };

  // Đăng ký
  const register = async (userData) => {
    try {
      const data = await userApi.register(userData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Đăng xuất
  const logout = () => {
    setCurrentUser(null);
    setToken('');
    localStorage.removeItem('token');
  };

  // Chỉ gọi /me khi reload page và có token
  useEffect(() => {
    const fetchMe = async () => {
      if (token && !currentUser) {
        try {
          const { user } = await userApi.getMe(token);
          setCurrentUser(user);
        } catch {
          setCurrentUser(null);
          setToken('');
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchMe();
  }, [token, currentUser]);

  const isAdmin = () => currentUser?.role === 'admin';
  const isAuthenticated = () => !!currentUser;

  return (
    <AuthContext.Provider value={{
      currentUser, token, login, register, logout, isAdmin, isAuthenticated, loading
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 