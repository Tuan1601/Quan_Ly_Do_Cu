import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as borrowApi from '../../api/borrowApi';

const Alerts = () => {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
     
      const requests = await borrowApi.getAllBorrowRequests(token);
      
      
      const activeRequests = requests.filter(req => 
        req.status === 'borrowed' && req.returnDate
      );

      
      const alertRequests = activeRequests.map(req => {
        const returnDate = new Date(req.returnDate);
        const now = new Date();
        const daysLeft = (returnDate - now) / (1000 * 60 * 60 * 24);
        return {
          ...req,
          daysLeft
        };
      }).filter(req => req.daysLeft <= 1) 
        .sort((a, b) => a.daysLeft - b.daysLeft); 

      setData(alertRequests);
      setError('');
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError('Không thể tải danh sách cảnh báo.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchAlerts();
  }, [token]);

 
  const formatTimeLeft = (daysLeft) => {
    if (daysLeft < 0) {
      const overdueDays = Math.abs(Math.floor(daysLeft));
      return `Quá hạn ${overdueDays} ngày`;
    }
    
    const hoursLeft = Math.floor(daysLeft * 24);
    if (hoursLeft === 0) {
      const minutesLeft = Math.floor(daysLeft * 24 * 60);
      return `Còn ${minutesLeft} phút`;
    }
    return `Còn ${hoursLeft} giờ`;
  };

  
  const getStatusStyle = (daysLeft) => {
    if (daysLeft < 0) return 'bg-red-100 text-red-800'; 
    if (daysLeft < 0.5) return 'bg-orange-100 text-orange-800'; 
    return 'bg-yellow-100 text-yellow-800'; 
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <h2 className="text-xl md:text-2xl font-bold">Cảnh báo thiết bị sắp/quá hạn trả</h2>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người mượn
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thiết bị
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Ngày mượn
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Ngày phải trả
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      Không có thiết bị nào sắp/quá hạn trả
                    </td>
                  </tr>
                ) : (
                  data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900 text-sm">
                          {item.user?.username || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.user?.email}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900 text-sm">
                          {item.equipment?.name}
                        </div>
                        <div className="text-xs text-gray-500 hidden md:block">
                          {item.equipment?.description}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {item.borrowDate ? new Date(item.borrowDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {item.returnDate ? new Date(item.returnDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(item.daysLeft)}`}>
                          {formatTimeLeft(item.daysLeft)}
                        </span>
                        <div className="text-xs text-gray-500 mt-1 md:hidden">
                          Trả: {item.returnDate ? new Date(item.returnDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts; 