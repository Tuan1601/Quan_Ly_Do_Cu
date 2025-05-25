import React, { useEffect, useState } from 'react';
import * as equipmentApi from '../../api/equipmentApi';
import { useAuth } from '../../contexts/AuthContext';

const PAGE_SIZE = 5;

const EquipmentList = () => {
  const { token } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    totalQuantity: 1,
    status: 'available',
    imageUrl: ''
  });
  const [search, setSearch] = useState('');
  const [detailItem, setDetailItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    minQuantity: '',
    maxQuantity: '',
    minAvailable: '',
    maxAvailable: '',
    fromDate: '',
    toDate: ''
  });

  // Fetch equipment list
  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const data = await equipmentApi.getAllEquipment();
      setEquipment(data);
    } catch (err) {
      setError('Không thể tải danh sách thiết bị.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  // Handle open modal for add/edit
  const openModal = (item = null) => {
    setEditItem(item);
    setForm(item ? {
      name: item.name,
      description: item.description,
      totalQuantity: item.totalQuantity,
      status: item.status,
      imageUrl: item.imageUrl
    } : { name: '', description: '', totalQuantity: 1, status: 'available', imageUrl: '' });
    setShowModal(true);
  };

  // Handle close modal
  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
    setForm({ name: '', description: '', totalQuantity: 1, status: 'available', imageUrl: '' });
    setError('');
  };

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle add/edit submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await equipmentApi.updateEquipment(editItem._id, form, token);
      } else {
        await equipmentApi.createEquipment(form, token);
      }
      closeModal();
      fetchEquipment();
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa thiết bị này?')) return;
    try {
      await equipmentApi.deleteEquipment(id, token);
      fetchEquipment();
    } catch (err) {
      setError('Không thể xóa thiết bị.');
    }
  };

  // Handle show detail
  const handleShowDetail = (item) => {
    setDetailItem(item);
  };
  const closeDetail = () => setDetailItem(null);

  // Search & Pagination
  const filteredEquipment = equipment.filter(
    (item) => {
      const matchSearch = !search || 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      
      const matchStatus = !filters.status || item.status === filters.status;
      const matchMinQuantity = !filters.minQuantity || item.totalQuantity >= Number(filters.minQuantity);
      const matchMaxQuantity = !filters.maxQuantity || item.totalQuantity <= Number(filters.maxQuantity);
      const matchMinAvailable = !filters.minAvailable || item.availableQuantity >= Number(filters.minAvailable);
      const matchMaxAvailable = !filters.maxAvailable || item.availableQuantity <= Number(filters.maxAvailable);
      
      const itemDate = new Date(item.createdAt);
      const matchFromDate = !filters.fromDate || itemDate >= new Date(filters.fromDate);
      const matchToDate = !filters.toDate || itemDate <= new Date(filters.toDate);

      return matchSearch && matchStatus && matchMinQuantity && matchMaxQuantity && 
             matchMinAvailable && matchMaxAvailable && matchFromDate && matchToDate;
    }
  );
  const totalPage = Math.ceil(filteredEquipment.length / PAGE_SIZE);
  const paginatedEquipment = filteredEquipment.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPage) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1); // Reset page when search changes
  }, [search]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      minQuantity: '',
      maxQuantity: '',
      minAvailable: '',
      maxAvailable: '',
      fromDate: '',
      toDate: ''
    });
    setSearch('');
    setCurrentPage(1);
  };

  return (
    <div className="p-4 max-w-[2000px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 md:h-7 w-6 md:w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Quản lý thiết bị
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Tìm kiếm thiết bị..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            className="px-3 py-2 rounded-lg border hover:bg-gray-50 flex items-center justify-center gap-1 transition-colors sm:flex-none"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showAdvancedFilters ? 'Ẩn bộ lọc' : 'Lọc nâng cao'}
          </button>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 sm:flex-none"
            onClick={() => openModal()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm thiết bị
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full border rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="available">Có sẵn</option>
                <option value="maintenance">Đang bảo trì</option>
                <option value="broken">Đã hỏng</option>
                <option value="unavailable">Không khả dụng</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tổng số lượng</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="minQuantity"
                  value={filters.minQuantity}
                  onChange={handleFilterChange}
                  placeholder="Từ"
                  className="w-full border rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  name="maxQuantity"
                  value={filters.maxQuantity}
                  onChange={handleFilterChange}
                  placeholder="Đến"
                  className="w-full border rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng khả dụng</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="minAvailable"
                  value={filters.minAvailable}
                  onChange={handleFilterChange}
                  placeholder="Từ"
                  className="w-full border rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  name="maxAvailable"
                  value={filters.maxAvailable}
                  onChange={handleFilterChange}
                  placeholder="Đến"
                  className="w-full border rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={handleFilterChange}
                  className="w-full border rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  name="toDate"
                  value={filters.toDate}
                  onChange={handleFilterChange}
                  className="w-full border rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Đặt lại bộ lọc
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
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

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {/* Table Section */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="scrollbar-custom overflow-x-auto">
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
              <table className="min-w-full table-fixed divide-y divide-gray-200 border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-32 bg-gray-50 sticky left-0 z-10">Hình ảnh</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b min-w-[200px]">Tên thiết bị</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b min-w-[300px]">Mô tả</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-28">Tổng SL</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-28">SL khả dụng</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-32">Trạng thái</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-32">Ngày tạo</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-40 bg-gray-50 sticky right-0 z-10">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedEquipment.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border-b w-32 bg-white sticky left-0 z-10">
                        {item.imageUrl ? (
                          <div className="relative w-24 h-24 mx-auto rounded-lg overflow-hidden bg-gray-50 border">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-contain hover:scale-110 transition-transform duration-200"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 mx-auto rounded-lg bg-gray-50 border flex items-center justify-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 border-b">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</div>
                      </td>
                      <td className="px-4 py-3 border-b">
                        <div className="text-sm text-gray-500 line-clamp-2">{item.description}</div>
                      </td>
                      <td className="px-4 py-3 border-b text-center text-sm">{item.totalQuantity}</td>
                      <td className="px-4 py-3 border-b text-center">
                        <span className={`text-sm font-medium ${
                          item.availableQuantity === 0 ? 'text-red-600' :
                          item.availableQuantity <= item.totalQuantity * 0.2 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {item.availableQuantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-b text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                          item.status === 'available' ? 'bg-green-100 text-green-800' :
                          item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          item.status === 'broken' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status === 'available' ? 'Có sẵn' :
                           item.status === 'maintenance' ? 'Đang bảo trì' :
                           item.status === 'broken' ? 'Đã hỏng' :
                           'Không khả dụng'}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-b text-center text-sm whitespace-nowrap">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                      </td>
                      <td className="px-4 py-3 border-b bg-white sticky right-0 z-10">
                        <div className="flex justify-center items-center gap-1">
                          <button
                            onClick={() => handleShowDetail(item)}
                            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors whitespace-nowrap"
                          >
                            Chi tiết
                          </button>
                          <button
                            onClick={() => openModal(item)}
                            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-50 rounded hover:bg-yellow-100 transition-colors whitespace-nowrap"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded hover:bg-red-100 transition-colors whitespace-nowrap"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <div className="text-sm text-gray-700 whitespace-nowrap">
              Hiển thị {(currentPage - 1) * PAGE_SIZE + 1} đến {Math.min(currentPage * PAGE_SIZE, filteredEquipment.length)} trong số {filteredEquipment.length} thiết bị
            </div>
            <div className="flex flex-wrap justify-center gap-2">
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
              {Array.from({ length: totalPage }, (_, i) => (
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
                disabled={currentPage === totalPage}
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

      {/* Modal thêm/sửa thiết bị */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">{editItem ? 'Sửa thiết bị' : 'Thêm thiết bị'}</h3>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block mb-1">Tên thiết bị</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Mô tả</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Tổng số lượng</label>
                    <input
                      type="number"
                      name="totalQuantity"
                      value={form.totalQuantity}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                      min={1}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Trạng thái</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    >
                      <option value="available">Có sẵn</option>
                      <option value="maintenance">Đang bảo trì</option>
                      <option value="broken">Đã hỏng</option>
                      <option value="unavailable">Không khả dụng</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block mb-1">URL Hình ảnh</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="https://example.com/image.jpg"
                  />
                  {form.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="max-h-40 object-contain"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  onClick={closeModal}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {editItem ? 'Lưu' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal chi tiết thiết bị */}
      {detailItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Chi tiết thiết bị</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {detailItem.imageUrl && (
                  <img
                    src={detailItem.imageUrl}
                    alt={detailItem.name}
                    className="w-full object-contain rounded"
                    style={{ maxHeight: '300px' }}
                  />
                )}
              </div>
              <div>
                <div className="mb-2"><b>Tên thiết bị:</b> {detailItem.name}</div>
                <div className="mb-2"><b>Mô tả:</b> {detailItem.description}</div>
                <div className="mb-2"><b>Tổng số lượng:</b> {detailItem.totalQuantity}</div>
                <div className="mb-2"><b>Số lượng khả dụng:</b> {detailItem.availableQuantity}</div>
                <div className="mb-2">
                  <b>Trạng thái:</b>
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    detailItem.status === 'available' ? 'bg-green-100 text-green-800' :
                    detailItem.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    detailItem.status === 'broken' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {detailItem.status === 'available' ? 'Có sẵn' :
                     detailItem.status === 'maintenance' ? 'Đang bảo trì' :
                     detailItem.status === 'broken' ? 'Đã hỏng' :
                     'Không khả dụng'}
                  </span>
                </div>
                {detailItem.createdAt && (
                  <div className="mb-2"><b>Ngày tạo:</b> {new Date(detailItem.createdAt).toLocaleString()}</div>
                )}
                {detailItem.updatedAt && (
                  <div className="mb-2"><b>Cập nhật lần cuối:</b> {new Date(detailItem.updatedAt).toLocaleString()}</div>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={closeDetail}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentList; 