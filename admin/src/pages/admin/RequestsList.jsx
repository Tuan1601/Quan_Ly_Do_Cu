import React, { useEffect, useState } from 'react';
import * as borrowApi from '../../api/borrowApi';
import { useAuth } from '../../contexts/AuthContext';

const STATUS_LABELS = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
  borrowed: 'Đã mượn',
  returned: 'Đã trả',
  overdue: 'Quá hạn',
};

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
  borrowed: 'bg-green-100 text-green-800',
  returned: 'bg-gray-100 text-gray-800',
  overdue: 'bg-orange-200 text-orange-800',
};

const PAGE_SIZE = 6;

const RequestsList = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    borrowDateFrom: '',
    borrowDateTo: '',
    expectedReturnDateFrom: '',
    expectedReturnDateTo: '',
    actualReturnDateFrom: '',
    actualReturnDateTo: '',
    quantity: '',
    equipment: '',
    user: ''
  });

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await borrowApi.getAllBorrowRequests(token);
      setRequests(data);
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách yêu cầu.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchRequests();
  }, [token]);

  const filteredRequests = requests.filter(req => {
    if (!req) return false;

    const searchLower = filters.search.toLowerCase();
    const matchSearch = !filters.search || 
      req.user?.username?.toLowerCase().includes(searchLower) ||
      req.user?.email?.toLowerCase().includes(searchLower) ||
      req.equipment?.name?.toLowerCase().includes(searchLower) ||
      req.notes?.toLowerCase().includes(searchLower);

    const matchStatus = !filters.status || req.status === filters.status;

    const matchBorrowDateFrom = !filters.borrowDateFrom || 
      new Date(req.borrowDate) >= new Date(filters.borrowDateFrom);

    const matchBorrowDateTo = !filters.borrowDateTo || 
      new Date(req.borrowDate) <= new Date(filters.borrowDateTo);

    const matchExpectedReturnFrom = !filters.expectedReturnDateFrom || 
      (req.expectedReturnDate && new Date(req.expectedReturnDate) >= new Date(filters.expectedReturnDateFrom));

    const matchExpectedReturnTo = !filters.expectedReturnDateTo || 
      (req.expectedReturnDate && new Date(req.expectedReturnDate) <= new Date(filters.expectedReturnDateTo));

    const matchActualReturnFrom = !filters.actualReturnDateFrom || 
      (req.actualReturnDate && new Date(req.actualReturnDate) >= new Date(filters.actualReturnDateFrom));

    const matchActualReturnTo = !filters.actualReturnDateTo || 
      (req.actualReturnDate && new Date(req.actualReturnDate) <= new Date(filters.actualReturnDateTo));

    const matchQuantity = !filters.quantity || req.quantity === Number(filters.quantity);

    const matchEquipment = !filters.equipment || 
      req.equipment?.name?.toLowerCase().includes(filters.equipment.toLowerCase());

    const matchUser = !filters.user || 
      req.user?.username?.toLowerCase().includes(filters.user.toLowerCase()) ||
      req.user?.email?.toLowerCase().includes(filters.user.toLowerCase());

    return matchSearch && matchStatus && matchBorrowDateFrom && matchBorrowDateTo && 
           matchExpectedReturnFrom && matchExpectedReturnTo &&
           matchActualReturnFrom && matchActualReturnTo &&
           matchQuantity && matchEquipment && matchUser;
  });

  const totalPages = Math.ceil(filteredRequests.length / PAGE_SIZE);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: '',
      borrowDateFrom: '',
      borrowDateTo: '',
      expectedReturnDateFrom: '',
      expectedReturnDateTo: '',
      actualReturnDateFrom: '',
      actualReturnDateTo: '',
      quantity: '',
      equipment: '',
      user: ''
    });
    setCurrentPage(1);
  };

  const openDetail = async (id) => {
    setActionLoading(true);
    try {
      const data = await borrowApi.getBorrowRequestById(id, token);
      setDetail(data);
      setAdminNotes(data.adminNotes || '');
      setError('');
    } catch (err) {
      setError('Không thể tải chi tiết yêu cầu.');
    }
    setActionLoading(false);
  };

  const closeDetail = () => {
    setDetail(null);
    setAdminNotes('');
    setConfirmAction(null);
  };

  const handleStatus = async (status) => {
    if (!detail) return;
    setActionLoading(true);
    try {
      await borrowApi.updateBorrowRequestStatus(detail._id, status, adminNotes, token);
      closeDetail();
      fetchRequests();
    } catch (err) {
      setError('Không thể cập nhật trạng thái.');
    }
    setActionLoading(false);
  };

  const handleConfirmBorrow = async () => {
    if (!detail) return;
    setActionLoading(true);
    try {
      await borrowApi.confirmBorrow(detail._id, token);
      closeDetail();
      fetchRequests();
      setError('');
    } catch (err) {
      setError('Không thể xác nhận mượn. Vui lòng thử lại.');
    }
    setActionLoading(false);
  };

  const handleConfirmReturn = async () => {
    if (!detail) return;
    setActionLoading(true);
    try {
      await borrowApi.confirmReturn(detail._id, token);
      closeDetail();
      fetchRequests();
      setError('');
    } catch (err) {
      setError('Không thể xác nhận trả. Vui lòng thử lại.');
    }
    setActionLoading(false);
  };

  const showConfirmDialog = (action, message) => {
    setConfirmAction({ action, message });
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Quản lý yêu cầu mượn
        </h2>
        <div className="flex gap-2 items-center">
          <button
            className="px-3 py-2 rounded border hover:bg-gray-100 flex items-center gap-1 transition-colors"
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block mb-1 font-medium text-gray-700">Tìm kiếm</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Tìm theo tên, email, thiết bị hoặc lý do..."
                className="w-full border px-3 py-2 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium text-gray-700">Trạng thái</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full border px-3 py-2 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Tất cả trạng thái</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-1 font-medium text-gray-700">Ngày mượn từ</label>
              <input
                type="date"
                name="borrowDateFrom"
                value={filters.borrowDateFrom}
                onChange={handleFilterChange}
                className="w-full border px-3 py-2 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Ngày mượn đến</label>
              <input
                type="date"
                name="borrowDateTo"
                value={filters.borrowDateTo}
                onChange={handleFilterChange}
                className="w-full border px-3 py-2 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium text-gray-700">Ngày trả DK từ</label>
              <input
                type="date"
                name="expectedReturnDateFrom"
                value={filters.expectedReturnDateFrom}
                onChange={handleFilterChange}
                className="w-full border px-3 py-2 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Ngày trả DK đến</label>
              <input
                type="date"
                name="expectedReturnDateTo"
                value={filters.expectedReturnDateTo}
                onChange={handleFilterChange}
                className="w-full border px-3 py-2 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium text-gray-700">Ngày trả TT từ</label>
              <input
                type="date"
                name="actualReturnDateFrom"
                value={filters.actualReturnDateFrom}
                onChange={handleFilterChange}
                className="w-full border px-3 py-2 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Ngày trả TT đến</label>
              <input
                type="date"
                name="actualReturnDateTo"
                value={filters.actualReturnDateTo}
                onChange={handleFilterChange}
                className="w-full border px-3 py-2 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium text-gray-700">Thiết bị</label>
              <input
                type="text"
                name="equipment"
                value={filters.equipment}
                onChange={handleFilterChange}
                placeholder="Tên thiết bị"
                className="w-full border px-3 py-2 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Số lượng</label>
              <input
                type="number"
                name="quantity"
                value={filters.quantity}
                onChange={handleFilterChange}
                placeholder="Chính xác số lượng"
                min="1"
                className="w-full border px-3 py-2 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium text-gray-700">Người mượn</label>
              <input
                type="text"
                name="user"
                value={filters.user}
                onChange={handleFilterChange}
                placeholder="Tên hoặc email"
                className="w-full border px-3 py-2 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4 gap-2">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
              onClick={resetFilters}
            >
              Đặt lại bộ lọc
            </button>
            <button
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              onClick={() => setShowFilters(false)}
            >
              Áp dụng bộ lọc
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded mb-4">
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
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="scrollbar-custom overflow-x-auto">
              <style>
                {`
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
                `}
              </style>
              <table className="min-w-full divide-y divide-gray-200 border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-b">
                      Người mượn
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-b">
                      Thiết bị
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20 border-b">
                      SL
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Lý do mượn
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-b">
                      Ngày mượn
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-b">
                      Ngày trả dự kiến
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-b">
                      Ngày trả thực tế
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-b">
                      Trạng thái
                    </th>
                    <th scope="col" className="sticky right-0 z-10 bg-gray-50 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24 border-b">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-gray-50">
                      <td className="sticky left-0 z-10 bg-white px-4 py-3 group-hover:bg-gray-50">
                        <div className="text-sm font-medium text-gray-900">{req.user?.username || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{req.user?.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">{req.equipment?.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{req.equipment?.description}</div>
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {req.quantity || 1}
                      </td>
                      <td className="px-4 py-3" style={{ maxWidth: '200px' }}>
                        <div 
                          className="text-sm text-gray-500 truncate overflow-hidden text-ellipsis whitespace-nowrap"
                          title={req.notes} 
                        >
                          {req.notes}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-sm whitespace-nowrap">
                        {req.borrowDate ? new Date(req.borrowDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-center text-sm whitespace-nowrap">
                        {req.expectedReturnDate ? new Date(req.expectedReturnDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-center text-sm whitespace-nowrap">
                        {req.actualReturnDate ? new Date(req.actualReturnDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${STATUS_COLORS[req.status]}`}>
                          {STATUS_LABELS[req.status]}
                        </span>
                      </td>
                      <td className="sticky right-0 z-10 bg-white px-4 py-3 text-right group-hover:bg-gray-50">
                        <button
                          onClick={() => openDetail(req._id)}
                          className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
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

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <div className="text-sm text-gray-700 whitespace-nowrap">
              Hiển thị {(currentPage - 1) * PAGE_SIZE + 1} đến {Math.min(currentPage * PAGE_SIZE, filteredRequests.length)} trong số {filteredRequests.length} yêu cầu
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 rounded border bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded border transition-colors min-w-[2.5rem] ${
                    currentPage === i + 1 
                      ? 'bg-indigo-600 text-white border-indigo-600 font-medium' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded border bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

      {detail && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Chi tiết yêu cầu mượn</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <h4 className="font-semibold mb-2">Thông tin người mượn</h4>
                <div className="space-y-2">
                  <div><b>Họ tên:</b> {detail.user?.username}</div>
                  <div><b>Email:</b> {detail.user?.email}</div>
                  <div><b>Số điện thoại:</b> {detail.user?.phoneNumber}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Thông tin thiết bị</h4>
                <div className="space-y-2">
                  <div><b>Tên thiết bị:</b> {detail.equipment?.name}</div>
                  <div><b>Mô tả:</b> {detail.equipment?.description}</div>
                  <div><b>Số lượng khả dụng:</b> {detail.equipment?.availableQuantity}/{detail.equipment?.totalQuantity}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div><b>Ngày mượn:</b> {detail.borrowDate ? new Date(detail.borrowDate).toLocaleDateString() : ''}</div>
              <div><b>Ngày trả dự kiến:</b> {detail.expectedReturnDate ? new Date(detail.expectedReturnDate).toLocaleDateString() : '-'}</div>
              <div><b>Ngày trả thực tế:</b> {detail.actualReturnDate ? new Date(detail.actualReturnDate).toLocaleDateString() : '-'}</div>
              <div><b>Lý do mượn:</b> {detail.notes}</div>
              <div>
                <b>Trạng thái:</b>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${STATUS_COLORS[detail.status]}`}>
                  {STATUS_LABELS[detail.status]}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">Ghi chú admin:</label>
              <textarea
                className="w-full border px-3 py-2 rounded"
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                rows={3}
                disabled={detail.status !== 'pending'}
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={closeDetail}
                disabled={actionLoading}
              >
                Đóng
              </button>

              {detail.status === 'pending' && (
                <>
                  <button
                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                    onClick={() => handleStatus('approved')}
                    disabled={actionLoading}
                  >
                    Duyệt
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    onClick={() => handleStatus('rejected')}
                    disabled={actionLoading}
                  >
                    Từ chối
                  </button>
                </>
              )}

              {detail.status === 'approved' && (
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => showConfirmDialog('borrow', 'Xác nhận cho mượn thiết bị? Số lượng khả dụng sẽ giảm 1.')}
                  disabled={actionLoading}
                >
                  Xác nhận đã mượn
                </button>
              )}

              {detail.status === 'borrowed' && (
                <button
                  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() => showConfirmDialog('return', 'Xác nhận đã trả thiết bị? Số lượng khả dụng sẽ tăng 1.')}
                  disabled={actionLoading}
                >
                  Xác nhận đã trả
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Xác nhận thao tác</h3>
            <p className="mb-6">{confirmAction.message}</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setConfirmAction(null)}
                disabled={actionLoading}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  if (confirmAction.action === 'borrow') {
                    handleConfirmBorrow();
                  } else if (confirmAction.action === 'return') {
                    handleConfirmReturn();
                  }
                  setConfirmAction(null);
                }}
                disabled={actionLoading}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsList;