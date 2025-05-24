import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const TopHeader = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="bg-gray-800 text-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-gray-300">Trang chủ</Link>
          <Link to="/equipment" className="hover:text-gray-300">Thiết bị</Link>
        </div>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <span>{currentUser.name}</span>
              <button 
                onClick={logout}
                className="hover:text-gray-300"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Đăng nhập</Link>
              <Link to="/register" className="hover:text-gray-300">Đăng ký</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopHeader; 