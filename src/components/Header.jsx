import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <span
            className="text-2xl font-extrabold"
            style={{
              fontFamily: "'Montserrat', 'Poppins', sans-serif",
              color: '#4F46E5', // Indigo-700
              letterSpacing: '1px'
            }}
          >
            PTIT
          </span>
          <span
            className="text-2xl font-bold ml-1"
            style={{
              fontFamily: "'Montserrat', 'Poppins', sans-serif",
              color: '#222',
              letterSpacing: '1px'
            }}
          >
            Equipment
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-600">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header; 