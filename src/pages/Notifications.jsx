import React from 'react';

const Notifications = () => {
  // Mock data
  const notifications = [
    {
      id: 1,
      title: 'Yêu cầu mượn thiết bị đã được duyệt',
      message: 'Yêu cầu mượn Laptop Dell XPS 13 của bạn đã được duyệt. Vui lòng đến nhận thiết bị trong ngày.',
      date: '2024-03-15 10:30',
      read: false
    },
    {
      id: 2,
      title: 'Nhắc nhở trả thiết bị',
      message: 'Thiết bị Arduino Uno R3 của bạn sắp đến hạn trả. Vui lòng trả thiết bị đúng hạn.',
      date: '2024-03-14 15:45',
      read: true
    },
    {
      id: 3,
      title: 'Yêu cầu mượn thiết bị bị từ chối',
      message: 'Yêu cầu mượn Raspberry Pi 4 của bạn đã bị từ chối do thiết bị không còn sẵn sàng.',
      date: '2024-03-13 09:15',
      read: true
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Thông báo</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg shadow-md p-6 ${
              !notification.read ? 'border-l-4 border-indigo-500' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold mb-2">{notification.title}</h2>
                <p className="text-gray-600">{notification.message}</p>
              </div>
              <span className="text-sm text-gray-500">{notification.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications; 