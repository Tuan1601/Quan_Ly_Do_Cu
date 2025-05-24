# Equipment Manager

Hệ thống quản lý mượn trả thiết bị dành cho sinh viên và câu lạc bộ.

## Tính năng

### Dành cho sinh viên
- Đăng nhập
- Xem danh sách thiết bị có sẵn
- Gửi yêu cầu mượn thiết bị
- Xem lịch sử mượn
- Nhận thông báo qua email

### Dành cho quản trị viên
- Quản lý yêu cầu mượn
- Quản lý danh sách thiết bị
- Theo dõi tồn kho
- Thống kê sử dụng
- Gửi thông báo tự động

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd equipment-manager
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file môi trường:
```bash
cp .env.example .env
```

4. Cập nhật các biến môi trường trong file `.env`

5. Chạy ứng dụng ở môi trường development:
```bash
npm run dev
```

## Công nghệ sử dụng

- React
- React Router
- Tailwind CSS
- Heroicons
- Vite

## Cấu trúc thư mục

```
src/
  ├── assets/        # Static files
  ├── components/    # Reusable components
  ├── contexts/      # React contexts
  ├── hooks/         # Custom hooks
  ├── layouts/       # Layout components
  ├── pages/         # Page components
  ├── services/      # API services
  ├── utils/         # Utility functions
  ├── App.jsx        # Root component
  └── main.jsx       # Entry point
```

## License

MIT 