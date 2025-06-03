import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaBell, FaUserCircle, FaSignOutAlt, FaUser, FaHistory, FaKey, FaEllipsisV } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:text-blue-200 transition py-1 group"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-blue-400 group-hover:border-blue-300 transition-colors">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-500 flex items-center justify-center">
              <FaUserCircle className="text-2xl text-white" />
            </div>
          )}
        </div>
        <span className="hidden md:inline group-hover:text-blue-200">{user.username}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
            <p className="text-sm font-semibold text-gray-900">{user.username}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <p className="text-xs text-gray-500">{user.phoneNumber}</p>
          </div>

          <div className="py-2">
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              onClick={() => setIsOpen(false)}
            >
              <FaUser className="text-gray-400" />
              <span>Thông tin cá nhân</span>
            </Link>

            <Link
              to="/history"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              onClick={() => setIsOpen(false)}
            >
              <FaHistory className="text-gray-400" />
              <span>Lịch sử mượn trả</span>
            </Link>

            <Link
              to="/change-password"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              onClick={() => setIsOpen(false)}
            >
              <FaKey className="text-gray-400" />
              <span>Đổi mật khẩu</span>
            </Link>

            <div className="border-t border-gray-100 my-2"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full"
            >
              <FaSignOutAlt className="text-red-500" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const TopHeader = () => {
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm py-2.5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="hidden md:flex items-center gap-6">
            <a href="tel:0123456789" className="flex items-center gap-2 hover:text-blue-200 transition">
              <FaPhoneAlt className="text-blue-300" /> 0123.456.789
            </a>
            <a href="mailto:support@equipmart.com" className="flex items-center gap-2 hover:text-blue-200 transition">
              <FaEnvelope className="text-blue-300" /> support@equipmart.com
            </a>
            <span className="hidden lg:flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-300" /> Học viên Công nghệ Bưu chính Viễn thông
            </span>
          </div>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-white hover:text-blue-200 transition"
          >
            <FaEllipsisV />
          </button>

          {showMobileMenu && (
            <div className="md:hidden w-full space-y-2 mt-2 border-t border-blue-500 pt-2">
              <a href="tel:0123456789" className="flex items-center gap-2 hover:text-blue-200 transition py-2">
                <FaPhoneAlt className="text-blue-300" /> 0123.456.789
              </a>
              <a href="mailto:support@equipmart.com" className="flex items-center gap-2 hover:text-blue-200 transition py-2">
                <FaEnvelope className="text-blue-300" /> support@equipmart.com
              </a>
              <span className="flex items-center gap-2 py-2">
                <FaMapMarkerAlt className="text-blue-300" /> Học viên Công nghệ Bưu chính Viễn thông
              </span>
            </div>
          )}

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/notifications"
                  className="p-2 hover:text-blue-200 transition relative group"
                >
                  <FaBell className="text-xl" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                      {notifications.length}
                    </span>
                  )}
                </Link>

                <UserMenu user={user} onLogout={logout} />
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="hover:text-blue-200 transition font-medium">
                  Đăng nhập
                </Link>
                <Link to="/register" className="hover:text-blue-200 transition font-medium">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader; 