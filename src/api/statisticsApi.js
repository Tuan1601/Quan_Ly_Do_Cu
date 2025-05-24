import axios from 'axios';

const EQUIPMENT_API = 'http://localhost:5001/api/equipment';
const BORROW_API = 'http://localhost:5001/api/borrow/admin';

export const getMostBorrowed = async (token, month, year) => {
  let url = `${EQUIPMENT_API}/stats/most-borrowed`;
  if (month && year) url += `?month=${month}&year=${year}`;
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getOverdueBorrows = async (token) => {
  const res = await axios.get(`${BORROW_API}/all?status=overdue`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}; 