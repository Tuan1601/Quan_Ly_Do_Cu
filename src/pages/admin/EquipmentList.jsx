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
  const [form, setForm] = useState({ name: '', description: '', totalQuantity: 1 });
  const [search, setSearch] = useState('');
  const [detailItem, setDetailItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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
      totalQuantity: item.totalQuantity
    } : { name: '', description: '', totalQuantity: 1 });
    setShowModal(true);
  };

  // Handle close modal
  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
    setForm({ name: '', description: '', totalQuantity: 1 });
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
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
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

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">Quản lý thiết bị</h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Tìm kiếm thiết bị..."
            className="border px-3 py-2 rounded"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            onClick={() => openModal()}
          >
            Thêm thiết bị
          </button>
        </div>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Tên thiết bị</th>
                <th className="px-4 py-2 border">Mô tả</th>
                <th className="px-4 py-2 border">Tổng số lượng</th>
                <th className="px-4 py-2 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEquipment.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-2 border">{item.name}</td>
                  <td className="px-4 py-2 border">{item.description}</td>
                  <td className="px-4 py-2 border text-center">{item.totalQuantity}</td>
                  <td className="px-4 py-2 border text-center flex flex-col sm:flex-row gap-2 justify-center items-center">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleShowDetail(item)}
                    >
                      Chi tiết
                    </button>
                    <button
                      className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                      onClick={() => openModal(item)}
                    >
                      Sửa
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(item._id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {Array.from({ length: totalPage }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded border ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPage}
        >
          &gt;
        </button>
      </div>
      {/* Modal thêm/sửa thiết bị */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{editItem ? 'Sửa thiết bị' : 'Thêm thiết bị'}</h3>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
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
              <div className="mb-3">
                <label className="block mb-1">Mô tả</label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-3">
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
              <div className="flex justify-end">
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
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Chi tiết thiết bị</h3>
            <div className="mb-2"><b>Tên thiết bị:</b> {detailItem.name}</div>
            <div className="mb-2"><b>Mô tả:</b> {detailItem.description}</div>
            <div className="mb-2"><b>Tổng số lượng:</b> {detailItem.totalQuantity}</div>
            {detailItem.availableQuantity !== undefined && (
              <div className="mb-2"><b>Số lượng còn lại:</b> {detailItem.availableQuantity}</div>
            )}
            {detailItem.status && (
              <div className="mb-2"><b>Trạng thái:</b> {detailItem.status}</div>
            )}
            {detailItem.createdAt && (
              <div className="mb-2"><b>Ngày tạo:</b> {new Date(detailItem.createdAt).toLocaleString()}</div>
            )}
            {detailItem.updatedAt && (
              <div className="mb-2"><b>Ngày cập nhật:</b> {new Date(detailItem.updatedAt).toLocaleString()}</div>
            )}
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