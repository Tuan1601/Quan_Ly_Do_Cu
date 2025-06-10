import React from "react";
import { Form, Input, Button, message, Row, Col, Card } from "antd";
import { updateProfile } from "../../../../services/Users/Auth";

const ChangePasswordForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    try {
      await updateProfile({ password: values.newPassword });
      message.success("Đổi mật khẩu thành công!");
      onBack();
    } catch {
      message.error("Đổi mật khẩu thất bại!");
    }
  };

  return (
    <Row justify="center" style={{ minHeight: "70vh", alignItems: "center" }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={8}>
        <Card
          title="Đổi mật khẩu"
          bordered={false}
          style={{
            borderRadius: 20,
            boxShadow: "0 6px 32px rgba(76,101,132,0.12)",
            background: "#f7f9fa",
            padding: 0,
          }}
          headStyle={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: 22,
            background: "#e3eaf2",
            borderRadius: "20px 20px 0 0",
          }}
        >
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            style={{
              background: "#fff",
              padding: 32,
              borderRadius: 16,
              boxShadow: "0 2px 16px rgba(76, 101, 132, 0.08)",
            }}
          >
            <Form.Item
              label="Mật khẩu hiện tại"
              name="oldPassword"
              rules={[{ required: true, message: "Nhập mật khẩu hiện tại" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu hiện tại" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[{ required: true, message: "Nhập mật khẩu mới" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>
            <Form.Item
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              rules={[{ required: true, message: "Xác nhận mật khẩu mới" }]}
            >
              <Input.Password placeholder="Xác nhận mật khẩu mới" />
            </Form.Item>
            <Row justify="space-between" gutter={16}>
              <Col>
                <Button
                  onClick={onBack}
                  style={{
                    borderRadius: 20,
                    fontWeight: 500,
                    background: "#fff",
                    border: "1.5px solid #5dade2",
                    color: "#5dade2",
                    boxShadow: "0 2px 8px rgba(90,173,226,0.07)",
                  }}
                >
                  ← Quay lại
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    minWidth: 120,
                    borderRadius: 24,
                    fontWeight: 500,
                    background: "#5dade2",
                    border: "none",
                  }}
                >
                  Đổi mật khẩu
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ChangePasswordForm;
