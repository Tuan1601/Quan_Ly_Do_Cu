import React, { useEffect, useState } from "react";
import { Card, Button, Spin, Row, Col, Typography, Avatar, Descriptions } from "antd";
import { EditOutlined, KeyOutlined, UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { getMe } from "../../../../services/Users/Auth";
import UpdateProfileForm from "./UpdateProfile";
import ChangePasswordForm from "./ChagePassword";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const ProfileInfo: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showChangePwd, setShowChangePwd] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await getMe();
        setUser(res && res.data ? res.data : res);
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <Spin size="large" />
      </div>
    );

  if (showUpdate)
    return (
      <UpdateProfileForm user={user} onBack={() => setShowUpdate(false)} onSuccess={() => window.location.reload()} />
    );

  if (showChangePwd) return <ChangePasswordForm onBack={() => setShowChangePwd(false)} />;

  return (
    <>
      <Row justify="center" style={{ minHeight: "70vh", alignItems: "center" }}>
        <Col xs={24} sm={22} md={18} lg={14} xl={10}>
          <Card
            style={{
              borderRadius: 20,
              boxShadow: "0 6px 32px rgba(76,101,132,0.12)",
              padding: 36,
              background: "#f7f9fa",
              position: "relative",
            }}
          >
            <Button
              onClick={() => navigate(-1)}
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                zIndex: 2,
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
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} md={8}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Avatar
                    size={120}
                    src={user?.avatarUrl || undefined}
                    icon={!user?.avatarUrl && <UserOutlined />}
                    style={{
                      background: "#e3eaf2",
                      marginBottom: 18,
                      border: "2.5px solid #5dade2",
                      boxShadow: "0 2px 8px rgba(90,173,226,0.15)",
                    }}
                  />
                  <Title level={3} style={{ marginBottom: 0, marginTop: 8, textAlign: "center", width: "100%" }}>
                    {user?.username}
                  </Title>
                </div>
              </Col>
              <Col xs={24} md={16}>
                <Descriptions
                  column={1}
                  size="middle"
                  labelStyle={{ fontWeight: 600, borderRadius: 8, padding: 8 }}
                  contentStyle={{ fontSize: 16, padding: "8px 0 8px 8px", marginLeft: 0 }}
                  style={{
                    marginBottom: 30,
                    border: "1px solid #e3eaf2",
                    borderRadius: 12,
                    background: "#fff",
                    padding: 16,
                  }}
                >
                  <Descriptions.Item
                    label={
                      <span>
                        <MailOutlined style={{ marginRight: 4 }} />
                        Tên
                      </span>
                    }
                  >
                    {user?.username}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span>
                        <MailOutlined style={{ marginRight: 4 }} />
                        Email
                      </span>
                    }
                  >
                    {user?.email}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span>
                        <PhoneOutlined style={{ marginRight: 4 }} />
                        Số điện thoại
                      </span>
                    }
                  >
                    {user?.phoneNumber || "Chưa cập nhật"}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span>
                        <UserOutlined style={{ marginRight: 4 }} />
                        Vai trò
                      </span>
                    }
                  >
                    {user?.role === "student" ? "Sinh viên" : user?.role}
                  </Descriptions.Item>
                </Descriptions>
                <div style={{ marginTop: 24, display: "flex", gap: 16, justifyContent: "flex-end" }}>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setShowUpdate(true)}
                    style={{
                      minWidth: 160,
                      fontWeight: 500,
                      height: 44,
                      borderRadius: 24,
                      background: "#5dade2",
                      border: "none",
                      boxShadow: "0 2px 8px rgba(90,173,226,0.10)",
                      transition: "background 0.2s",
                    }}
                    ghost
                  >
                    Cập nhật thông tin
                  </Button>
                  <Button
                    icon={<KeyOutlined />}
                    onClick={() => setShowChangePwd(true)}
                    style={{
                      minWidth: 160,
                      fontWeight: 500,
                      height: 44,
                      borderRadius: 24,
                      background: "#fff",
                      color: "#5dade2",
                      border: "1.5px solid #5dade2",
                      boxShadow: "0 2px 8px rgba(90,173,226,0.07)",
                      transition: "background 0.2s, color 0.2s",
                    }}
                    type="default"
                  >
                    Đổi mật khẩu
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProfileInfo;
