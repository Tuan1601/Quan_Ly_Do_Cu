import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as equipmentApi from '../../api/equipmentApi';
import * as borrowApi from '../../api/borrowApi';
import * as statisticsApi from '../../api/statisticsApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const Dashboard = () => {
  const { token } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [requests, setRequests] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [eq, req, od, st] = await Promise.all([
          equipmentApi.getAllEquipment(),
          borrowApi.getAllBorrowRequests(token),
          statisticsApi.getOverdueBorrows(token),
          statisticsApi.getMostBorrowed(token, new Date().getMonth() + 1, new Date().getFullYear())
        ]);
        setEquipment(eq);
        setRequests(req);
        setOverdue(od);
        setStats(st);
      } catch {}
      setLoading(false);
    };
    if (token) fetchAll();
    // eslint-disable-next-line
  }, [token]);

  // Tổng số liệu
  const totalEquipment = equipment.length;
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const borrowedCount = requests.filter(r => r.status === 'borrowed').length;
  const overdueCount = overdue.length;

  // Thiết bị tồn kho thấp
  const lowStock = equipment
    .filter(e => e.availableQuantity !== undefined)
    .sort((a, b) => a.availableQuantity - b.availableQuantity)
    .slice(0, 5);

  // Yêu cầu mới nhất
  const latestRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tổng quan hệ thống</h2>
      {/* Cards tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-gray-500">Tổng thiết bị</div>
          <div className="text-2xl font-bold">{totalEquipment}</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-gray-500">Tổng yêu cầu mượn</div>
          <div className="text-2xl font-bold">{totalRequests}</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-gray-500">Chờ duyệt</div>
          <div className="text-2xl font-bold">{pendingRequests}</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-gray-500">Đang mượn</div>
          <div className="text-2xl font-bold">{borrowedCount}</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-gray-500">Quá hạn</div>
          <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
        </div>
      </div>
      {/* Biểu đồ nhanh */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <h3 className="font-bold mb-2">Top thiết bị mượn nhiều tháng này</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="borrowCount" fill="#6366F1" name="Số lượt mượn" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Danh sách yêu cầu mới nhất */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-bold mb-2">Yêu cầu mượn mới nhất</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="px-3 py-2 font-bold text-gray-700 text-center">Người mượn</th>
                  <th className="px-3 py-2 font-bold text-gray-700 text-center">Thiết bị</th>
                  <th className="px-3 py-2 font-bold text-gray-700 text-center">Ngày tạo</th>
                  <th className="px-3 py-2 font-bold text-gray-700 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {latestRequests.map((req, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-indigo-50 transition"
                  >
                    <td className="px-3 py-2 text-center">{req.user?.username || req.user?.email}</td>
                    <td className="px-3 py-2 text-center">{req.equipment?.name}</td>
                    <td className="px-3 py-2 text-center">{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ''}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={
                        req.status === 'pending' ? 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold'
                        : req.status === 'approved' ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold'
                        : req.status === 'borrowed' ? 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold'
                        : req.status === 'returned' ? 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold'
                        : req.status === 'overdue' ? 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold'
                        : 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold'
                      }>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Thiết bị tồn kho thấp */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-bold mb-2">Thiết bị tồn kho thấp</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="px-3 py-2 font-bold text-gray-700 text-center">Tên thiết bị</th>
                  <th className="px-3 py-2 font-bold text-gray-700 text-center">Còn lại</th>
                  <th className="px-3 py-2 font-bold text-gray-700 text-center">Tổng số lượng</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((item, idx) => (
                  <tr key={idx} className="hover:bg-indigo-50 transition">
                    <td className="px-3 py-2 text-center">{item.name}</td>
                    <td className="px-3 py-2 text-center text-red-600 font-bold">{item.availableQuantity}</td>
                    <td className="px-3 py-2 text-center">{item.totalQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Cảnh báo nhanh */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-bold mb-2 text-red-600">Cảnh báo thiết bị quá hạn</h3>
        {overdue.length === 0 ? (
          <div>Không có thiết bị quá hạn.</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1">Người mượn</th>
                <th className="px-2 py-1">Thiết bị</th>
                <th className="px-2 py-1">Ngày trả</th>
                <th className="px-2 py-1">Số ngày quá hạn</th>
              </tr>
            </thead>
            <tbody>
              {overdue.slice(0, 5).map((item, idx) => {
                const overdueDays = item.returnDate ? Math.max(0, Math.ceil((Date.now() - new Date(item.returnDate)) / (1000*60*60*24))) : '-';
                return (
                  <tr key={idx}>
                    <td className="px-2 py-1">{item.user?.username || item.user?.email}</td>
                    <td className="px-2 py-1">{item.equipment?.name}</td>
                    <td className="px-2 py-1">{item.returnDate ? new Date(item.returnDate).toLocaleDateString() : ''}</td>
                    <td className="px-2 py-1 text-red-600 font-bold">{overdueDays}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 