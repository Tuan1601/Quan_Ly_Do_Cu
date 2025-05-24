import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as statisticsApi from '../../api/statisticsApi';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

const Statistics = () => {
  const { token } = useAuth();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Filter nâng cao
  const [search, setSearch] = useState('');
  const [minBorrow, setMinBorrow] = useState('');
  const [maxBorrow, setMaxBorrow] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const stats = await statisticsApi.getMostBorrowed(token, month, year);
      setData(stats);
    } catch {
      setError('Không thể tải thống kê.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchStats();
    // eslint-disable-next-line
  }, [token, month, year]);

  // Lọc dữ liệu theo filter nâng cao
  const filteredData = data.filter(item => {
    const matchName = item.name.toLowerCase().includes(search.toLowerCase());
    const matchMin = minBorrow === '' || item.borrowCount >= Number(minBorrow);
    const matchMax = maxBorrow === '' || item.borrowCount <= Number(maxBorrow);
    return matchName && matchMin && matchMax;
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Thống kê thiết bị mượn nhiều</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <label>
          Tháng:
          <select className="ml-1 border rounded px-2 py-1" value={month} onChange={e => setMonth(Number(e.target.value))}>
            {[...Array(12)].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>
        </label>
        <label>
          Năm:
          <input
            type="number"
            className="ml-1 border rounded px-2 py-1 w-20"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            min={2000}
            max={2100}
          />
        </label>
        <input
          type="text"
          className="border rounded px-2 py-1"
          placeholder="Tìm theo tên thiết bị..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          type="number"
          className="border rounded px-2 py-1 w-28"
          placeholder="Số lượt mượn tối thiểu"
          value={minBorrow}
          onChange={e => setMinBorrow(e.target.value)}
          min={0}
        />
        <input
          type="number"
          className="border rounded px-2 py-1 w-28"
          placeholder="Số lượt mượn tối đa"
          value={maxBorrow}
          onChange={e => setMaxBorrow(e.target.value)}
          min={0}
        />
        <button className="ml-2 px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={fetchStats}>Làm mới</button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <>
          {filteredData.length > 0 && (
            <div className="w-full h-80 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="borrowCount" fill="#6366F1" name="Số lượt mượn" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Tên thiết bị</th>
                  <th className="px-4 py-2 border">Số lượt mượn</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr><td colSpan={2} className="text-center py-4">Không có dữ liệu</td></tr>
                ) : filteredData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 border">{item.name}</td>
                    <td className="px-4 py-2 border text-center">{item.borrowCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics; 