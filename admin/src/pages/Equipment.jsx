import React from 'react';

const Equipment = () => {
  // Mock data
  const equipmentList = [
    {
      id: 1,
      name: 'Laptop Dell XPS 13',
      category: 'Laptop',
      available: 5,
      total: 10,
      description: 'Laptop cao cấp cho sinh viên CNTT'
    },
    {
      id: 2,
      name: 'Arduino Uno R3',
      category: 'Điện tử',
      available: 15,
      total: 20,
      description: 'Board mạch Arduino cho thực hành IoT'
    },
    {
      id: 3,
      name: 'Raspberry Pi 4',
      category: 'Điện tử',
      available: 8,
      total: 12,
      description: 'Máy tính nhúng cho dự án IoT'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Danh sách thiết bị</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipmentList.map(equipment => (
          <div key={equipment.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{equipment.name}</h2>
            <p className="text-gray-600 mb-2">Loại: {equipment.category}</p>
            <p className="text-gray-600 mb-2">{equipment.description}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                Còn lại: {equipment.available}/{equipment.total}
              </span>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                Mượn
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Equipment; 