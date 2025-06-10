import { Form, Input, Button, Typography } from "antd";
import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
  onSubmit: (values: { phoneNumber?: string; email?: string; username?: string; password: string }) => void;
  type: "login" | "register";
  role: "student" | "admin";
}

const { Title, Text, Link } = Typography;

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, type, role }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  // Xác định đường dẫn chuyển đổi giữa login/register
  const isLogin = type === "login";
  const switchPath = isLogin ? "/register" : "/login";

  // Responsive style
  const formStyle: React.CSSProperties = {
    maxWidth: 400,
    width: "95vw",
    margin: "0 auto",
    marginTop: 40,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
    padding: window.innerWidth < 400 ? 16 : 32,
    transition: "all 0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f6fa 60%, #e6eafc 100%)",
        padding: 8,
      }}
    >
      <div style={formStyle}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          style={{
            marginBottom: 12,
            paddingLeft: 0,
            color: "#1677ff",
            fontWeight: 500,
            fontSize: 16,
          }}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Form form={form} name="auth_form" onFinish={handleFinish} layout="vertical" style={{ marginTop: 8 }}>
          <Title level={3} style={{ textAlign: "center", marginBottom: 24, fontWeight: 700 }}>
            {isLogin ? "Đăng nhập" : "Đăng ký"} {role === "admin" ? "Admin" : "User"}
          </Title>
          {!isLogin && (
            <>
              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input type="email" size="large" />
              </Form.Item>
              <Form.Item
                label="Tên đăng nhập"
                name="username"
                rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
              >
                <Input size="large" />
              </Form.Item>
            </>
          )}
          {isLogin && (
            <>
              <Form.Item
                label={role === "admin" ? "Tên đăng nhập" : "Email"}
                name={role === "admin" ? "username" : "email"}
                rules={
                  role === "admin"
                    ? [{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]
                    : [
                        { required: true, message: "Vui lòng nhập email!" },
                        { type: "email", message: "Email không hợp lệ!" },
                      ]
                }
              >
                <Input size="large" />
              </Form.Item>
            </>
          )}
          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                height: 44,
                fontWeight: 600,
                fontSize: 16,
                borderRadius: 8,
                marginTop: 4,
              }}
            >
              {isLogin ? "Đăng nhập" : "Đăng ký"}
            </Button>
          </Form.Item>
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <Text>
              {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
              <Link
                onClick={() => navigate(switchPath)}
                style={{ fontWeight: 600, color: "#1677ff", cursor: "pointer" }}
              >
                {isLogin ? "Đăng ký" : "Đăng nhập"}
              </Link>
            </Text>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AuthForm;
