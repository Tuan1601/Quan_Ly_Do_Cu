import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User & Auth APIs
export const userApi = {
  // Register new user (student or admin)
  register: (userData: { username: string; email: string; password: string; role?: string }) =>
    api.post('/users/register', userData),

  // Login user
  login: (credentials: { email: string; password: string }) =>
    api.post('/users/login', credentials),

  // Get current user info
  getCurrentUser: () => api.get('/users/me'),
};

// Equipment APIs
export const equipmentApi = {
  // Create new equipment (admin only)
  create: (equipmentData: { name: string; description: string; totalQuantity: number }) =>
    api.post('/equipment', equipmentData),

  // Get all equipment
  getAll: () => api.get('/equipment'),

  // Get equipment by ID
  getById: (id: string) => api.get(`/equipment/${id}`),

  // Update equipment (admin only)
  update: (id: string, updateData: {
    description?: string;
    totalQuantity?: number;
    availableQuantity?: number;
    status?: string;
  }) => api.put(`/equipment/${id}`, updateData),

  // Delete equipment (admin only)
  delete: (id: string) => api.delete(`/equipment/${id}`),

  // Get most borrowed equipment stats
  getMostBorrowed: (month?: number, year?: number) => {
    let url = '/equipment/stats/most-borrowed';
    if (month && year) {
      url += `?month=${month}&year=${year}`;
    }
    return api.get(url);
  },
};

// Borrow Request APIs
export const borrowApi = {
  // Create borrow request (student)
  create: (borrowData: {
    equipmentId: string;
    quantityBorrowed: number;
    borrowDate: string;
    expectedReturnDate: string;
    notes: string;
  }) => api.post('/borrow', borrowData),

  // Get student's borrow history
  getMyHistory: () => api.get('/borrow/my-history'),

  // Admin APIs for managing borrow requests
  admin: {
    // Get all borrow requests
    getAll: (status?: string) => {
      let url = '/borrow/admin/all';
      if (status) {
        url += `?status=${status}`;
      }
      return api.get(url);
    },

    // Get specific borrow request details
    getById: (requestId: string) =>
      api.get(`/borrow/admin/${requestId}`),

    // Manage borrow request (approve/reject)
    manageBorrowRequest: (requestId: string, updateData: {
      status: 'approved' | 'rejected';
      adminNotes: string;
    }) => api.put(`/borrow/admin/manage/${requestId}`, updateData),

    // Confirm equipment has been borrowed
    confirmBorrow: (requestId: string) =>
      api.put(`/borrow/admin/confirm-borrow/${requestId}`, {}),

    // Confirm equipment has been returned
    confirmReturn: (requestId: string) =>
      api.put(`/borrow/admin/confirm-return/${requestId}`, {}),
  },
};

export default {
  userApi,
  equipmentApi,
  borrowApi,
};
