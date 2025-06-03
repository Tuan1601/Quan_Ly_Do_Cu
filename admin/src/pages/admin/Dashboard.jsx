import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as equipmentApi from '../../api/equipmentApi';
import * as borrowApi from '../../api/borrowApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const Dashboard = () => {
  const { token } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [eq, req] = await Promise.all([
          equipmentApi.getAllEquipment(),
          borrowApi.getAllBorrowRequests(token)
        ]);
        setEquipment(eq);
        setRequests(req);
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      }
      setLoading(false);
    };
    if (token) fetchAll();
  }, [token]);

  const totalEquipment = equipment.length;
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const borrowedCount = requests.filter(r => r.status === 'borrowed').length;
  const overdueCount = requests.filter(r => r.status === 'overdue').length;

  const lowStock = equipment
    .filter(e => {
      if (e.availableQuantity === undefined) return false;
      return e.availableQuantity <= 2;
    })
    .sort((a, b) => a.availableQuantity - b.availableQuantity)
    .slice(0, 5);

  const latestRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const stats = requests
    .filter(req => {
      const borrowDate = new Date(req.borrowDate);
      return borrowDate.getMonth() + 1 === currentMonth && 
             borrowDate.getFullYear() === currentYear;
    })
    .reduce((acc, req) => {
      if (req.equipment) {
        const key = req.equipment.name;
        if (!acc[key]) {
          acc[key] = {
            name: key,
            borrowCount: 0
          };
        }
        acc[key].borrowCount += 1;
      }
      return acc;
    }, {});

  const monthlyStats = Object.values(stats)
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .slice(0, 5);

  if (loading) return (
    <div className="p-4 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
      <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
    </div>
  );
  
  if (error) return (
    <div className="p-4">
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-[2000px] mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 md:h-7 w-6 md:w-7 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
        Tổng quan hệ thống
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
          <div className="text-gray-500 text-sm font-medium">Tổng thiết bị</div>
          <div className="text-2xl font-bold mt-2">{totalEquipment}</div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
          <div className="text-gray-500 text-sm font-medium">Tổng yêu cầu mượn</div>
          <div className="text-2xl font-bold mt-2">{totalRequests}</div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
          <div className="text-gray-500 text-sm font-medium">Chờ duyệt</div>
          <div className="text-2xl font-bold mt-2 text-yellow-600">{pendingRequests}</div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
          <div className="text-gray-500 text-sm font-medium">Đang mượn</div>
          <div className="text-2xl font-bold mt-2 text-blue-600">{borrowedCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
          <div className="text-gray-500 text-sm font-medium">Quá hạn</div>
          <div className="text-2xl font-bold mt-2 text-red-600">{overdueCount}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          Top thiết bị mượn nhiều tháng {currentMonth}/{currentYear}
        </h3>
        {monthlyStats.length > 0 ? (
          <div className="w-full h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyStats} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  tick={{ fontSize: 12, fill: '#4B5563' }}
                  stroke="#9CA3AF"
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: '#4B5563' }}
                  stroke="#9CA3AF"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                  cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                />
                <Legend 
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{
                    paddingTop: '10px'
                  }}
                />
                <Bar 
                  dataKey="borrowCount"
                  fill="#6366F1"
                  name="Số lượt mượn"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-500">Chưa có dữ liệu thống kê trong tháng này</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Yêu cầu mượn mới nhất
            </h3>
          </div>
          <div className="overflow-x-auto scrollbar-custom">
            <style jsx>{`
              .scrollbar-custom::-webkit-scrollbar {
                height: 8px;
              }
              .scrollbar-custom::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
              }
              .scrollbar-custom::-webkit-scrollbar-thumb {
                background: #ddd;
                border-radius: 4px;
              }
              .scrollbar-custom::-webkit-scrollbar-thumb:hover {
                background: #cdcdcd;
              }
            `}</style>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Người mượn
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Thiết bị
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {latestRequests.length > 0 ? (
                  latestRequests.map((req, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{req.user?.username || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{req.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{req.equipment?.name}</div>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          req.status === 'approved' ? 'bg-green-100 text-green-800' :
                          req.status === 'borrowed' ? 'bg-blue-100 text-blue-800' :
                          req.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          req.status === 'returned' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {req.status === 'pending' ? 'Chờ duyệt' :
                           req.status === 'approved' ? 'Đã duyệt' :
                           req.status === 'borrowed' ? 'Đang mượn' :
                           req.status === 'overdue' ? 'Quá hạn' :
                           req.status === 'returned' ? 'Đã trả' :
                           req.status === 'rejected' ? 'Từ chối' :
                           req.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-gray-500">Chưa có yêu cầu mượn nào</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Cảnh báo tồn kho thấp
            </h3>
          </div>
          <div className="overflow-x-auto scrollbar-custom">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Thiết bị
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Còn lại
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Tổng số
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lowStock.length > 0 ? (
                  lowStock.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${item.availableQuantity === 0 
                            ? 'bg-red-100 text-red-800' 
                            : item.availableQuantity === 1 
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {item.availableQuantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span className="text-sm text-gray-500">{item.totalQuantity}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      <p className="text-gray-500">Không có thiết bị nào tồn kho thấp</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;