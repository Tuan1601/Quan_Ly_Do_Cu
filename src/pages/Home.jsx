import React from 'react';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Chào mừng đến với PTIT Equipment</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Mượn thiết bị</h2>
          <p className="text-gray-600">Đăng ký mượn thiết bị phục vụ học tập và nghiên cứu.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quản lý yêu cầu</h2>
          <p className="text-gray-600">Theo dõi trạng thái các yêu cầu mượn thiết bị của bạn.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Thông báo</h2>
          <p className="text-gray-600">Nhận thông báo về trạng thái yêu cầu và thời hạn trả thiết bị.</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 