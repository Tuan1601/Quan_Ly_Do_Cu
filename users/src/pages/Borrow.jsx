import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSpinner, FaCalendar, FaBox, FaClipboardList, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import { getEquipmentById } from '../api/userApi';
import { createBorrowRequest } from '../api/borrowingApi';

const Borrow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const equipmentId = searchParams.get('equipmentId');

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    quantityBorrowed: 1,
    borrowDate: '',
    expectedReturnDate: '',
    notes: ''
  });

  useEffect(() => {
    if (equipmentId) {
      fetchEquipment();
    }
  }, [equipmentId]);

  const fetchEquipment = async () => {
    try {
      const response = await getEquipmentById(equipmentId);
      setEquipment(response.data);
    } catch (error) {
      setError('Không thể tải thông tin thiết bị');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await createBorrowRequest({
        equipmentId,
        ...formData
      });
      setSuccess('Yêu cầu mượn thiết bị đã được gửi thành công!');
      setTimeout(() => {
        navigate('/history');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.msg || 'Có lỗi xảy ra khi gửi yêu cầu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-blue-600 text-3xl mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin thiết bị...</p>
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="text-center">
          <FaInfoCircle className="text-red-500 text-3xl mx-auto mb-4" />
          <p className="text-red-600 font-medium">Không tìm thấy thiết bị</p>
          <button
            onClick={() => navigate('/equipment')}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2"
          >
            <FaArrowLeft /> Quay lại danh sách thiết bị
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 group transition-colors"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Yêu cầu mượn thiết bị</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Equipment Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-w-3 aspect-h-2">
                <img
                  src={equipment?.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={equipment?.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <div className="p-4 sm:p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{equipment?.name}</h2>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <FaBox className="w-5 h-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Số lượng có sẵn</p>
                      <p className="font-medium">{equipment?.availableQuantity} / {equipment?.totalQuantity}</p>
                    </div>
                  </div>
                  <div className="flex items-start text-gray-700">
                    <FaClipboardList className="w-5 h-5 text-blue-500 mr-3 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Mô tả</p>
                      <p className="text-gray-800">{equipment?.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Borrow Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
              {(error || success) && (
                <div className="mb-6">
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FaInfoCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {success && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FaInfoCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-green-700">{success}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng mượn
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="quantityBorrowed"
                      min="1"
                      max={equipment?.availableQuantity}
                      value={formData.quantityBorrowed}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500 text-sm">/ {equipment?.availableQuantity}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày mượn
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="borrowDate"
                        value={formData.borrowDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 transition-colors"
                        required
                      />
                      <FaCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày trả dự kiến
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="expectedReturnDate"
                        value={formData.expectedReturnDate}
                        onChange={handleChange}
                        min={formData.borrowDate || new Date().toISOString().split('T')[0]}
                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 transition-colors"
                        required
                      />
                      <FaCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Mục đích sử dụng, yêu cầu đặc biệt..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform transition-all hover:-translate-y-0.5"
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Đang xử lý...
                      </>
                    ) : (
                      'Gửi yêu cầu mượn'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Borrow; 