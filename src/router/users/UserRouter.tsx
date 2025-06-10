import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import UsersLogin from "../../pages/Users/Auth/Login";
import UsersRegister from "../../pages/Users/Auth/Register";
import UserDashboard from "../../pages/Users/Dashboard/index";
// import EquipmentDetail from "../../pages/Users/Equipment/Detail";
// import BorrowHistory from "../../pages/Users/Borrow/History";
// import Profile from "../../pages/Users/Profile";
import { useAuthUser } from "../../contexts/Users/UserContext";

// Component bảo vệ route cần đăng nhập
const RequireUserLogin: React.FC = () => {
  const { isAuthenticated, loading } = useAuthUser();
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const UserRouter: React.FC = () => (
  <Routes>
    {/* Route công khai */}
    <Route path="/" element={<UserDashboard />} />
    {/* <Route path="/equipment/:id" element={<EquipmentDetail />} /> */}
    <Route path="/login" element={<UsersLogin />} />
    <Route path="/register" element={<UsersRegister />} />

    {/* Route cần đăng nhập */}
    <Route element={<RequireUserLogin />}>
      {/* <Route path="/borrow/history" element={<BorrowHistory />} />
      <Route path="/profile" element={<Profile />} /> */}
      {/* Thêm các route cần đăng nhập khác ở đây */}
      {/* Ví dụ: <Route path="/borrow/request" element={<BorrowRequest />} /> */}
    </Route>
  </Routes>
);

export default UserRouter;
