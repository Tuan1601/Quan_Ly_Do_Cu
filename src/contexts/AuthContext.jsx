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
      // Nếu backend trả về { _id, username, email, role, token }
      const user = {
        _id: res._id,
        username: res.username,
        email: res.email,
        role: res.role,
      };
      const token = res.token;
      setCurrentUser(user);
      setToken(token);
      localStorage.setItem('token', token);
      return user;
    } catch (error) {
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

  // Lấy thông tin user hiện tại nếu có token
  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
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
  }, [token]);

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