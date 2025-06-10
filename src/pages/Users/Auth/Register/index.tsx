import React from "react";
import AuthForm from "../../../../components/AuthForm";
import { message } from "antd";
import { useAuthUser } from "../../../../contexts/Users/UserContext";

const UsersRegister: React.FC = () => {
  const { register } = useAuthUser();

  const handleRegister = async (values: {
    username?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
  }) => {
    try {
      await register({
        username: values.username ?? "",
        email: values.email ?? "",
        password: values.password ?? "",
        phoneNumber: values.phoneNumber ?? "",
        role: "student",
      });
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Đăng ký thất bại!");
    }
  };

  return <AuthForm onSubmit={handleRegister} type="register" role="student" />;
};

export default UsersRegister;
