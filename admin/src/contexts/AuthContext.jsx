import React, { createContext, useState, useContext, useEffect } from 'react';
import * as userApi from '../api/userApi';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);


  const login = async (email, password) => {
    try {
      const res = await userApi.login(email, password);
    
      const userData = res; 
      setToken(userData.token);
      setCurrentUser({
        _id: userData._id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        avatarUrl: userData.avatarUrl
      });
      localStorage.setItem('token', userData.token);
      console.log('Login success:', userData); 
      return userData;
    } catch (error) {
      console.log('Login error:', error); 
      setCurrentUser(null);
      setToken('');
      localStorage.removeItem('token');
      throw error;
    }
  };

 
  const register = async (userData) => {
    try {
      const data = await userApi.register(userData);
      return data;
    } catch (error) {
      throw error;
    }
  };

 
  const logout = () => {
    setCurrentUser(null);
    setToken('');
    localStorage.removeItem('token');
  };

  
  useEffect(() => {
    const fetchMe = async () => {
      if (token && !currentUser) {
        try {
          const { user } = await userApi.getMe(token);
          setCurrentUser({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl
          });
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