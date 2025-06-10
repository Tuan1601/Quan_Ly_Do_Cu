import AuthForm from "../../../../components/AuthForm";
import { useAuthAdmin } from "../../../../contexts/Admin/AdminContext";

const AdminLogin: React.FC = () => {
  const { login } = useAuthAdmin();

  const handleLogin = async (values: { phoneNumber?: string; email?: string; username?: string; password: string }) => {
    try {
      if (!values.username) {
        throw new Error("Tên đăng nhập là bắt buộc");
      }
      await login(values.username, values.password);
      window.location.href = "/admin";
    } catch (error) {}
  };

  return <AuthForm onSubmit={handleLogin} type="login" role="admin" />;
};
export default AdminLogin;
