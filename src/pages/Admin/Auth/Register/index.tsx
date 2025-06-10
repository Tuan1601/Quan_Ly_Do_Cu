import React from "react";
import AuthForm from "../../../../components/AuthForm";
import { useAuthAdmin } from "../../../../contexts/Admin/AdminContext";

const AdminRegister: React.FC = () => {
  const { register } = useAuthAdmin();

  const handleRegister = (values: { username?: string; email?: string; password?: string; phoneNumber?: string }) => {
    register({
      username: values.username ?? "",
      email: values.email ?? "",
      password: values.password ?? "",
      phoneNumber: values.phoneNumber ?? "",
    });
  };

  return <AuthForm onSubmit={handleRegister} type="register" role="admin" />;
};

export default AdminRegister;
