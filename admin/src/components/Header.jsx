import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').slice(0, 2);
  };

  const formatDateTime = (date) => {
    return date.toLocaleString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {/* <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg> */}
          </button>

          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-xl lg:text-2xl font-extrabold text-indigo-600">PTIT</span>
              <span className="text-xl lg:text-2xl font-bold text-gray-800">Equipment</span>
            </div>
            <div className="hidden lg:block h-8 w-px bg-gray-300 mx-4"></div>
            <div className="hidden lg:block text-sm text-gray-600">
              {formatDateTime(currentTime)}
            </div>
          </div>

          {/* Admin Profile Section */}
          <div className="relative">
            <button
              className="flex items-center space-x-3 bg-white rounded-lg p-2 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="flex items-center">
                <div className="text-right mr-3 hidden sm:block">
                  <p className="text-sm font-semibold text-gray-700">{user?.username || 'Admin'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="Admin avatar"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-indigo-600"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {getInitials(user?.username || user?.email)}
                  </div>
                )}
              </div>
            </button>

            {/* Enhanced Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-700">{user?.username}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Quản trị viên</p>
                </div>
                
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Đăng nhập lần cuối:</p>
                  <p className="text-sm text-gray-700">{new Date().toLocaleString('vi-VN')}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3zm11.707 4.707a1 1 0 0 0-1.414-1.414L10 9.586 8.707 8.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-3 border-t border-gray-200">
            <div className="pt-4 pb-3 space-y-1">
              <div className="text-sm text-gray-600 px-2">
                {formatDateTime(currentTime)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {(showDropdown || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-5"
          onClick={() => {
            setShowDropdown(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header; 