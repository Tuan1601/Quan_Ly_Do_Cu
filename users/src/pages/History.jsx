import React, { useState, useEffect } from 'react';
import { FaSpinner, FaSearch, FaFilter, FaCalendar, FaSortAmountDown, FaEye, FaCheckCircle, FaTimesCircle, FaHistory, FaClock, FaImage, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { getBorrowingHistory } from '../api/borrowingApi';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: 'borrowDate', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await getBorrowingHistory();
      const processedHistory = response.data.map(item => {
        if (item.status === 'borrowed' && item.expectedReturnDate) {
          const expectedDate = new Date(item.expectedReturnDate);
          const now = new Date();
          if (expectedDate < now) {
            return { ...item, status: 'overdue' };
          }
        }
        return item;
      });
      setHistory(processedHistory);
    } catch (error) {
      setError('Không thể tải lịch sử mượn trả');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'approved':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'returned':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'borrowed':
        return 'text-violet-600 bg-violet-100 border-violet-200';
      case 'overdue':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="mr-1" />;
      case 'approved':
        return <FaCheckCircle className="mr-1" />;
      case 'rejected':
        return <FaTimesCircle className="mr-1" />;
      case 'returned':
        return <FaHistory className="mr-1" />;
      case 'borrowed':
        return <FaCheckCircle className="mr-1" />;
      case 'overdue':
        return <FaExclamationTriangle className="mr-1" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ duyệt';
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      case 'returned':
        return 'Đã trả';
      case 'borrowed':
        return 'Đang mượn';
      case 'overdue':
        return 'Quá hạn';
      default:
        return status;
    }
  };

  const handleSort = (field) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  const filteredAndSortedHistory = history
    .filter(item => {
      const matchesFilter = filter === 'all' || item.status === filter;
      const matchesSearch = 
        item.equipment?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipment?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.note && item.note.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      if (sortConfig.field === 'borrowDate') {
        return direction * (new Date(a.borrowDate) - new Date(b.borrowDate));
      }
      return direction * (a[sortConfig.field] > b[sortConfig.field] ? 1 : -1);
    });

  const totalPages = Math.ceil(filteredAndSortedHistory.length / itemsPerPage);
  const paginatedHistory = filteredAndSortedHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lịch sử mượn trả</h1>
          
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm thiết bị..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-2.5"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors w-full sm:w-auto"
            >
              <FaFilter />
              <span>Bộ lọc</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="borrowed">Đang mượn</option>
                  <option value="returned">Đã trả</option>
                  <option value="rejected">Từ chối</option>
                  <option value="overdue">Quá hạn</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sắp xếp theo</label>
                <select
                  value={sortConfig.field}
                  onChange={(e) => handleSort(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="borrowDate">Ngày mượn</option>
                  <option value="returnDate">Ngày trả</option>
                  <option value="status">Trạng thái</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thứ tự</label>
                <select
                  value={sortConfig.direction}
                  onChange={(e) => setSortConfig(prev => ({ ...prev, direction: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="desc">Mới nhất</option>
                  <option value="asc">Cũ nhất</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng thời gian</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tất cả</option>
                  <option value="today">Hôm nay</option>
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                  <option value="year">Năm nay</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <FaSpinner className="animate-spin text-blue-600 text-2xl" />
        </div>
      ) : paginatedHistory.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Không có lịch sử mượn trả nào
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thiết bị
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Số lượng
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Ngày mượn
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Ngày trả dự kiến
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedHistory.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              src={item.equipment?.imageUrl || 'https://via.placeholder.com/40?text=NA'}
                              alt=""
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.equipment?.name}
                            </div>
                            <div className="text-sm text-gray-500 hidden sm:block">
                              ID: {item.equipment?._id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-sm text-gray-900">{item.quantityBorrowed}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          <span className="ml-1">{getStatusText(item.status)}</span>
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="text-sm text-gray-900">
                          {formatDate(item.borrowDate)}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="text-sm text-gray-900">
                          {item.expectedReturnDate ? formatDate(item.expectedReturnDate) : '-'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 min-w-[80px]"
              >
                Trước
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  if (totalPages <= 5) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (Math.abs(currentPage - page) <= 1) return true;
                  return false;
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[40px] px-3 py-1 rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 min-w-[80px]"
              >
                Tiếp
              </button>
            </div>
          )}
        </>
      )}

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">Chi tiết mượn trả</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="h-16 w-16 flex-shrink-0">
                    <img
                      src={selectedItem.equipment?.imageUrl || 'https://via.placeholder.com/64?text=NA'}
                      alt=""
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      {selectedItem.equipment?.name}
                    </h4>
                    <p className="text-sm text-gray-500">ID: {selectedItem.equipment?._id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Số lượng mượn</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.quantityBorrowed}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Trạng thái</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(selectedItem.status)}`}>
                      {getStatusIcon(selectedItem.status)}
                      <span className="ml-1">{getStatusText(selectedItem.status)}</span>
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ngày mượn</p>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedItem.borrowDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ngày trả (dự kiến)</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedItem.expectedReturnDate ? formatDate(selectedItem.expectedReturnDate) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ghi chú</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.notes || '-'}</p>
                  </div>
                </div>

                {selectedItem.status === 'borrowed' && (
                  <div className="pt-4 border-t border-gray-200">
                    {/* Đã bỏ nút Trả thiết bị ở đây */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History; 