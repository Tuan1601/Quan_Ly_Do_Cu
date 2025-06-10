import React from "react";
import { Form, Input, Button, message, Row, Col, Avatar } from "antd";
import { updateProfile } from "../../../../services/Users/Auth";
import { ArrowLeftOutlined, SaveOutlined, UserOutlined } from "@ant-design/icons";

const UpdateProfileForm: React.FC<{ user: any; onBack: () => void; onSuccess: () => void }> = ({
  user,
  onBack,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = React.useState(user?.avatarUrl || "");

  const onFinish = async (values: any) => {
    try {
      await updateProfile({ ...values, avatarUrl });
      message.success("Cập nhật thành công!");
      onSuccess();
    } catch {
      message.error("Cập nhật thất bại!");
    }
  };

  return (
    <Row justify="center">
      <Col xs={24} sm={20} md={16} lg={12} xl={10}>
        <Form
          form={form}
          initialValues={{
            username: user?.username,
            phoneNumber: user?.phoneNumber,
            avatarUrl: user?.avatarUrl,
          }}
          onFinish={onFinish}
          layout="vertical"
          style={{
            background: "#fff",
            padding: 32,
            borderRadius: 16,
            boxShadow: "0 2px 16px rgba(76, 101, 132, 0.08)",
            marginTop: 24,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Avatar
              size={96}
              src={avatarUrl || undefined}
              icon={!avatarUrl && <UserOutlined />}
              style={{
                background: "#e3eaf2",
                border: "2px solid #5dade2",
                marginBottom: 8,
              }}
            />
            <div style={{ color: "#888", fontSize: 13 }}>Ảnh đại diện</div>
          </div>
          <Form.Item
            label="Link ảnh đại diện"
            name="avatarUrl"
            rules={[{ type: "url", message: "Vui lòng nhập đúng định dạng URL!" }]}
          >
            <Input
              placeholder="Dán link ảnh đại diện..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              allowClear
            />
          </Form.Item>
          <Form.Item label="Họ và tên" name="username" rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}>
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              { pattern: /^[0-9]{9,12}$/, message: "Số điện thoại không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Row justify="space-between" gutter={16}>
            <Col>
              <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
                Quay lại
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                style={{
                  minWidth: 120,
                  borderRadius: 24,
                  fontWeight: 500,
                  background: "#5dade2",
                  border: "none",
                }}
              >
                Lưu
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default UpdateProfileForm;
