import { Outlet, Navigate } from "react-router-dom";
import { useAuthAdmin } from "../../contexts/Admin/AdminContext";

const AdminRoute = () => {
  const { isAuthenticated } = useAuthAdmin();

  // Nếu chưa đăng nhập, chuyển hướng về trang login admin
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
