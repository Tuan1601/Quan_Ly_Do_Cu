import axios from './axiosConfig';

export const getNotifications = () => {
  return axios.get('/notifications');
};

export const markAsRead = (notificationId) => {
  return axios.put(`/notifications/${notificationId}/read`);
};

export const markAllAsRead = () => {
  return axios.put('/notifications/mark-all-read');
};

export const deleteNotification = (notificationId) => {
  return axios.delete(`/notifications/${notificationId}`);
}; 