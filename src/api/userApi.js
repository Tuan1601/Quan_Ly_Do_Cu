import axios from 'axios';

const API_URL = 'https://second-hand-club.onrender.com/api/users';

export const register = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data;
};

export const login = async (email, password) => {
  const res = await axios.post('https://second-hand-club.onrender.com/api/users/login', { email, password });
  return res.data;
};

export const getMe = async (token) => {
  try {
    if (!token) {
      throw new Error('No authentication token provided');
    }

    const res = await axios.get(`${API_URL}/me`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.data) {
      throw new Error('No data received from server');
    }

    return {
      success: true,
      data: res.data,
      message: 'User information retrieved successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status
    };
  }
};
