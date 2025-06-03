import axios from 'axios';

const API_URL = 'https://second-hand-club.onrender.com/api/equipment';


export const getAllEquipment = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};


export const getEquipmentById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};


export const createEquipment = async (data, token) => {
  const res = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};


export const updateEquipment = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};


export const deleteEquipment = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}; 