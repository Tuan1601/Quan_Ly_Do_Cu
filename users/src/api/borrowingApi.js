import axios from './axiosConfig';

// Get borrowing history for current user
export const getBorrowingHistory = () => {
  return axios.get('/borrow/my-history');
};

// Create new borrow request
export const createBorrowRequest = (data) => {
  return axios.post('/borrow', data);
};

export const getBorrowDetails = (id) => {
  return axios.get(`/borrow/${id}`);
};

export const cancelBorrow = (id) => {
  return axios.put(`/borrow/${id}/cancel`);
};

export const returnEquipment = (id) => {
  return axios.put(`/borrow/${id}/return`);
}; 