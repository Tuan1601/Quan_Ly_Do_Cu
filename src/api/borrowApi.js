import axios from 'axios';

const API_URL = 'https://second-hand-club.onrender.com/api/borrow/admin';

export const getAllBorrowRequests = async (token, status = '') => {
  const res = await axios.get(`${API_URL}/all${status ? `?status=${status}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getBorrowRequestById = async (id, token) => {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateBorrowRequestStatus = async (id, status, adminNotes, token) => {
  const res = await axios.put(`${API_URL}/manage/${id}`, { status, adminNotes }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const confirmBorrow = async (id, token) => {
  const res = await axios.put(`${API_URL}/confirm-borrow/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const confirmReturn = async (id, token) => {
  const res = await axios.put(`${API_URL}/confirm-return/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}; 