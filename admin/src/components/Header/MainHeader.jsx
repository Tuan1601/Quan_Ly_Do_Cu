import React from 'react';
import { Link } from 'react-router-dom';

const MainHeader = () => {
  return (
    <div className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="../../api/logo.svg" alt="PTIT Equipment" className="h-10 w-auto mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">PTIT Equipment</h1>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/notifications" className="text-gray-600 hover:text-gray-800">
              Thông báo
            </Link>
            <Link to="/my-requests" className="text-gray-600 hover:text-gray-800">
              Yêu cầu của tôi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHeader; 