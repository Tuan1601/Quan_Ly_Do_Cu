import React from "react";
import AuthForm from "../../../../components/AuthForm";
import { message } from "antd";
import { useAuthUser } from "../../../../contexts/Users/UserContext";
import { useNavigate } from "react-router-dom";

const UsersLogin: React.FC = () => {
  const { login } = useAuthUser();
  const navigate = useNavigate();

  const handleLogin = async (values: { email?: string; password: string }) => {
    try {
      if (!values.email) {
        message.error("Vui lòng nhập email!");
        return;
      }
      await login(values.email, values.password);
      message.success("Đăng nhập thành công!");
      navigate("/");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  return <AuthForm onSubmit={handleLogin} type="login" role="student" />;
};

export default UsersLogin;
