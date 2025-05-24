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

const RequestsList = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [detail, setDetail] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await borrowApi.getAllBorrowRequests(token, filter);
      setRequests(data);
    } catch (err) {
      setError('Không thể tải danh sách yêu cầu.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchRequests();
    // eslint-disable-next-line
  }, [token, filter]);

  const openDetail = async (id) => {
    setActionLoading(true);
    try {
      const data = await borrowApi.getBorrowRequestById(id, token);
      setDetail(data);
      setAdminNotes(data.adminNotes || '');
    } catch {
      setError('Không thể tải chi tiết yêu cầu.');
    }
    setActionLoading(false);
  };

  const closeDetail = () => {
    setDetail(null);
    setAdminNotes('');
  };

  const handleStatus = async (status) => {
    if (!detail) return;
    setActionLoading(true);
    try {
      await borrowApi.updateBorrowRequestStatus(detail._id, status, adminNotes, token);
      closeDetail();
      fetchRequests();
    } catch {
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
    } catch {
      setError('Không thể xác nhận mượn.');
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
    } catch {
      setError('Không thể xác nhận trả.');
    }
    setActionLoading(false);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">Quản lý yêu cầu mượn</h2>
        <select
          className="border px-3 py-2 rounded"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
          <option value="borrowed">Đã mượn</option>
          <option value="returned">Đã trả</option>
          <option value="overdue">Quá hạn</option>
        </select>
      </div>
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
                <th className="px-4 py-2 border">Trạng thái</th>
                <th className="px-4 py-2 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td className="px-4 py-2 border">{req.user?.username || req.user?.email}</td>
                  <td className="px-4 py-2 border">{req.equipment?.name}</td>
                  <td className="px-4 py-2 border">{req.borrowDate ? new Date(req.borrowDate).toLocaleDateString() : ''}</td>
                  <td className="px-4 py-2 border">{req.returnDate ? new Date(req.returnDate).toLocaleDateString() : ''}</td>
                  <td className="px-4 py-2 border">{STATUS_LABELS[req.status] || req.status}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      onClick={() => openDetail(req._id)}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal chi tiết yêu cầu */}
      {detail && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Chi tiết yêu cầu mượn</h3>
            <div className="mb-2"><b>Người mượn:</b> {detail.user?.username || detail.user?.email}</div>
            <div className="mb-2"><b>Email:</b> {detail.user?.email}</div>
            <div className="mb-2"><b>Thiết bị:</b> {detail.equipment?.name}</div>
            <div className="mb-2"><b>Ngày mượn:</b> {detail.borrowDate ? new Date(detail.borrowDate).toLocaleString() : ''}</div>
            <div className="mb-2"><b>Ngày trả:</b> {detail.returnDate ? new Date(detail.returnDate).toLocaleString() : ''}</div>
            <div className="mb-2"><b>Lý do:</b> {detail.reason}</div>
            <div className="mb-2"><b>Trạng thái:</b> {STATUS_LABELS[detail.status] || detail.status}</div>
            <div className="mb-2"><b>Ghi chú admin:</b></div>
            <textarea
              className="w-full border px-2 py-1 rounded mb-2"
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              rows={2}
              disabled={detail.status !== 'pending' && detail.status !== 'approved'}
            />
            <div className="flex flex-wrap gap-2 justify-end mt-4">
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
                  onClick={handleConfirmBorrow}
                  disabled={actionLoading}
                >
                  Xác nhận đã mượn
                </button>
              )}
              {detail.status === 'borrowed' && (
                <button
                  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={handleConfirmReturn}
                  disabled={actionLoading}
                >
                  Xác nhận đã trả
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsList; 