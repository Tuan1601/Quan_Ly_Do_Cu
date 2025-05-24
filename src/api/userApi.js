import axios from 'axios';

const API_URL = 'http://localhost:5001/api/users';

export const register = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data; // { user, ... }
};

export const login = async (email, password) => {
  const res = await axios.post('http://localhost:5001/api/users/login', { email, password });
  return res.data; // { user, token }
};

export const getMe = async (token) => {
  const res = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; // { user }
};
