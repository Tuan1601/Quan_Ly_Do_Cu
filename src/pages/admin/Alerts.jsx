import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as statisticsApi from '../../api/statisticsApi';

const Alerts = () => {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const alerts = await statisticsApi.getOverdueBorrows(token);
      setData(alerts);
    } catch {
      setError('Không thể tải danh sách cảnh báo.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchAlerts();
    // eslint-disable-next-line
  }, [token]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Cảnh báo thiết bị quá hạn trả</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Người mượn</th>
                <th className="px-4 py-2 border">Thiết bị</th>
                <th className="px-4 py-2 border">Ngày mượn</th>
                <th className="px-4 py-2 border">Ngày trả</th>
                <th className="px-4 py-2 border">Số ngày quá hạn</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-4">Không có thiết bị quá hạn</td></tr>
              ) : data.map((item, idx) => {
                const overdueDays = item.returnDate ? Math.max(0, Math.ceil((Date.now() - new Date(item.returnDate)) / (1000*60*60*24))) : '-';
                return (
                  <tr key={idx}>
                    <td className="px-4 py-2 border">{item.user?.username || item.user?.email}</td>
                    <td className="px-4 py-2 border">{item.equipment?.name}</td>
                    <td className="px-4 py-2 border">{item.borrowDate ? new Date(item.borrowDate).toLocaleDateString() : ''}</td>
                    <td className="px-4 py-2 border">{item.returnDate ? new Date(item.returnDate).toLocaleDateString() : ''}</td>
                    <td className="px-4 py-2 border text-center text-red-600 font-bold">{overdueDays}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Alerts; 