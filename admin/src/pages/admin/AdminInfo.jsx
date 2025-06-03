import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as userApi from '../../api/userApi';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCamera, FaEnvelope, FaPhone, FaSpinner, FaKey } from 'react-icons/fa';

const AdminInfo = () => {
  const { token } = useAuth();
  const [admin, setAdmin] = useState(null);
  const [form, setForm] = useState({ username: '', phoneNumber: '' });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      const res = await userApi.getMe(token);
      if (res.success) {
        setAdmin(res.data);
        setForm({
          username: res.data.username || '',
          phoneNumber: res.data.phoneNumber || '',
        });
        setAvatarUrl(res.data.avatarUrl || '');
        setError('');
      } else {
        setError(res.error || 'Không thể tải thông tin admin.');
      }
      setLoading(false);
    };
    if (token) fetchAdmin();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    const res = await userApi.updateProfile({
      username: form.username,
      phoneNumber: form.phoneNumber,
    }, token);
    if (res.success) {
      setSuccess('Cập nhật thông tin thành công!');
      setAdmin(res.data);
    } else {
      setError(res.error || 'Cập nhật thất bại.');
    }
    setSaving(false);
  };

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    if (!avatarUrl) {
      setError('Vui lòng nhập URL ảnh đại diện');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    const res = await userApi.updateProfile({ avatarUrl }, token);
    if (res.success) {
      setSuccess('Cập nhật ảnh đại diện thành công!');
      setAdmin(res.data);
      setIsEditingAvatar(false);
    } else {
      setError(res.error || 'Cập nhật ảnh đại diện thất bại.');
    }
    setSaving(false);
  };

  const handleAvatarClick = () => {
    setIsEditingAvatar(true);
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Thông tin quản trị viên</h1>
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                {admin?.avatarUrl ? (
                  <img
                    src={admin.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaUser className="w-12 h-12" />
                  </div>
                )}
                <button
                  onClick={handleAvatarClick}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  type="button"
                >
                  <FaCamera className="text-white text-xl" />
                </button>
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{admin?.username}</h2>
                <p className="text-gray-600">{admin?.email}</p>
              </div>
              <button
                onClick={() => navigate('/admin/change-password')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <FaKey />
                <span>Đổi mật khẩu</span>
              </button>
            </div>
            {isEditingAvatar && (
              <form onSubmit={handleAvatarSubmit} className="mt-4 flex flex-col gap-2">
                <input
                  type="url"
                  placeholder="Nhập URL ảnh đại diện..."
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? <FaSpinner className="animate-spin inline mr-2" /> : null}
                    Lưu ảnh
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingAvatar(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={admin?.email}
                    disabled
                    className="w-full rounded-lg border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Đang cập nhật...
                    </>
                  ) : (
                    'Cập nhật thông tin'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInfo; 