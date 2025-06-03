import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner, FaArrowLeft, FaClock, FaBoxOpen, FaCheckCircle, FaExclamationCircle, FaTools } from 'react-icons/fa';
import { getEquipmentById } from '../api/userApi';
import { createBorrowRequest } from '../api/borrowingApi';
import { useAuth } from '../contexts/AuthContext';

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [borrowing, setBorrowing] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      const response = await getEquipmentById(id);
      setEquipment(response.data);
    } catch (error) {
      setError('Không thể tải thông tin thiết bị');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setBorrowing(true);
    setError('');
    setSuccess('');

    try {
      await createBorrowRequest({ equipmentId: id });
      setSuccess('Yêu cầu mượn thiết bị đã được gửi!');
      fetchEquipment();
    } catch (error) {
      setError(error.response?.data?.msg || 'Có lỗi xảy ra khi yêu cầu mượn thiết bị');
    } finally {
      setBorrowing(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'available':
        return {
          icon: <FaCheckCircle />,
          text: 'Có sẵn',
          className: 'bg-green-100 text-green-800'
        };
      case 'maintenance':
        return {
          icon: <FaTools />,
          text: 'Đang bảo trì',
          className: 'bg-yellow-100 text-yellow-800'
        };
      case 'broken':
        return {
          icon: <FaExclamationCircle />,
          text: 'Đã hỏng',
          className: 'bg-red-100 text-red-800'
        };
      default:
        return {
          icon: <FaExclamationCircle />,
          text: 'Không sẵn hàng',
          className: 'bg-gray-100 text-gray-800'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <FaSpinner className="animate-spin text-blue-600 text-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <FaExclamationCircle />
          {error}
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy thiết bị
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 group transition-colors"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span>Quay lại</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="lg:flex">
          <div className="lg:w-1/2 relative">
            <div className="aspect-w-4 aspect-h-3">
              <img
                src={equipment.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image'}
                alt={equipment.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-4 right-4">
              <span
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ${getStatusInfo(equipment.status).className}`}
              >
                {getStatusInfo(equipment.status).icon} {getStatusInfo(equipment.status).text}
              </span>
            </div>
          </div>

          <div className="lg:w-1/2 p-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {equipment.name}
                </h1>
                <p className="text-sm text-gray-500">Mã thiết bị: {equipment.code}</p>
              </div>

              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả chi tiết</h3>
                <p className="text-gray-600 leading-relaxed">
                  {equipment.description || 'Không có mô tả chi tiết'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 py-6 border-y border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FaBoxOpen className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số lượng có sẵn</p>
                    <p className="text-lg font-semibold text-gray-900">{equipment.availableQuantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FaClock className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Thời gian mượn tối đa</p>
                    <p className="text-lg font-semibold text-gray-900">{equipment.maxBorrowDuration} ngày</p>
                  </div>
                </div>
              </div>

              {success && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-lg">
                  <FaCheckCircle className="flex-shrink-0" />
                  <p>{success}</p>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg">
                  <FaExclamationCircle className="flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                onClick={handleBorrow}
                disabled={equipment.status !== 'available' || borrowing}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all
                  ${equipment.status === 'available'
                    ? 'bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-0.5'
                    : 'bg-gray-400 cursor-not-allowed'
                  }`}
              >
                {borrowing ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    {equipment.status === 'available' ? 'Mượn thiết bị' : getStatusInfo(equipment.status).text}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail; 