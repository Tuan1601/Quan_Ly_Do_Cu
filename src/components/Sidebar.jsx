import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>
      <nav className="mt-4">
        <ul>
          <li className={`p-2 ${isActive('/admin') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <Link to="/admin" className="block">Dashboard</Link>
          </li>
          <li className={`p-2 ${isActive('/admin/requests') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <Link to="/admin/requests" className="block">Quản lý yêu cầu</Link>
          </li>
          <li className={`p-2 ${isActive('/admin/equipment') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <Link to="/admin/equipment" className="block">Quản lý thiết bị</Link>
          </li>
          <li className={`p-2 ${isActive('/admin/statistics') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <Link to="/admin/statistics" className="block">Thống kê</Link>
          </li>
          <li className={`p-2 ${isActive('/admin/alerts') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <Link to="/admin/alerts" className="block">Cảnh báo</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 