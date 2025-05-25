import axiosClient from './axiosConfig';

const userApi = {
  login: (data) => {
    return axiosClient.post('/users/login', data);
  },
  register: (data) => {
    return axiosClient.post('/users/register', data);
  },
  getMe: () => {
    return axiosClient.get('/users/me');
  },
  updateProfile: (data) => {
    return axiosClient.put('/users/profile', data);
  },
  getEquipment: (params) => {
    return axiosClient.get('/equipment', { params });
  },
  getEquipmentById: (id) => {
    return axiosClient.get(`/equipment/${id}`);
  },
  searchEquipment: (query) => {
    return axiosClient.get('/equipment/search', { 
      params: { query }
    });
  },
  getBorrowingHistory: () => {
    return axiosClient.get('/borrowing/history');
  },
  createBorrowRequest: (data) => {
    return axiosClient.post('/borrowing/request', data);
  },
  cancelBorrowRequest: (id) => {
    return axiosClient.delete(`/borrowing/request/${id}`);
  }
};

export const { 
  login, 
  register, 
  getMe,
  updateProfile,
  getEquipment,
  getEquipmentById,
  searchEquipment,
  getBorrowingHistory,
  createBorrowRequest,
  cancelBorrowRequest
} = userApi;

export default userApi; 