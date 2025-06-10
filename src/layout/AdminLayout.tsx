import React, { useEffect, useState } from "react";
import { Layout, Menu, Dropdown, Avatar, Button, Grid } from "antd";
import { MenuOutlined, UserOutlined, LogoutOutlined, LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuthAdmin } from "../contexts/Admin/AdminContext";
import { getMe } from "../services/Admin/Auth";

const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

// Màu trung tính/xanh ghi
const COLOR_BG = "#e3eaf2";
const COLOR_HEADER = "#4b6584";
const COLOR_HEADER_TEXT = "#f5f6fa";
const COLOR_CARD = "#f7f9fa";
const COLOR_MENU = "#f0f4f8";
const COLOR_MENU_TEXT = "#222b45";
const COLOR_ACCENT = "#5dade2";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { currentUser, logout, isAuthenticated } = useAuthAdmin();
  const screens = useBreakpoint();
  const [adminProfile, setAdminProfile] = useState<any>(null);

  const handleLogoClick = () => {
    navigate("/admin");
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          setAdminProfile(null);
          return;
        }
        const res = await getMe(token);
        setAdminProfile(res && res.data ? res.data : res);
      } catch {
        setAdminProfile(null);
      }
    };
    fetchAdmin();
  }, []);

  const menu = (
    <Menu
      style={{
        minWidth: 180,
        borderRadius: 8,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: 8,
        background: COLOR_MENU,
        color: COLOR_MENU_TEXT,
      }}
      theme="light"
    >
      {isAuthenticated() ? (
        <>
          <Menu.Item
            key="profile"
            disabled
            style={{ cursor: "default", background: "#eaf0f6", color: COLOR_MENU_TEXT }}
          >
            <Avatar
              src={adminProfile?.avatarUrl && adminProfile.avatarUrl.trim() !== "" ? adminProfile.avatarUrl : undefined}
              icon={!adminProfile?.avatarUrl || adminProfile.avatarUrl.trim() === "" ? <UserOutlined /> : undefined}
              style={{
                marginRight: 8,
                background: !adminProfile?.avatarUrl || adminProfile.avatarUrl.trim() === "" ? COLOR_ACCENT : undefined,
                verticalAlign: "middle",
              }}
            >
              {(!adminProfile?.avatarUrl || adminProfile.avatarUrl.trim() === "") && adminProfile?.username
                ? adminProfile.username.charAt(0).toUpperCase()
                : null}
            </Avatar>
            <span style={{ fontWeight: 500 }}>{adminProfile?.username || "Chưa có tên"}</span>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="profile-link" icon={<UserOutlined />} onClick={() => navigate("/admin/profile")}>
            Thông tin cá nhân
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout} style={{ color: "#e17055" }}>
            Đăng xuất
          </Menu.Item>
        </>
      ) : (
        <Menu.Item key="login" icon={<LoginOutlined />} onClick={() => navigate("/admin/login")}>
          Đăng nhập
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh", background: COLOR_BG }}>
      <Header
        style={{
          background: COLOR_HEADER,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: screens.xs ? "0 10px" : "0 40px",
          height: 64,
          boxShadow: "0 2px 8px rgba(76, 101, 132, 0.10)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            gap: 12,
            transition: "opacity 0.2s",
            opacity: 0.97,
          }}
          onClick={handleLogoClick}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "0.97")}
        >
          <img src="/ad27bc12ca81e862ceb35328122757ee.png" alt="Logo" style={{ height: 38, marginRight: 8 }} />
          <span
            style={{
              fontWeight: 700,
              fontSize: screens.xs ? 18 : 26,
              color: COLOR_HEADER_TEXT,
              letterSpacing: 1,
              textShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            EquipMart Admin
          </span>
        </div>
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight" arrow>
          <Button
            icon={<MenuOutlined />}
            size="large"
            style={{
              border: "none",
              background: "#d6e4f0",
              color: COLOR_HEADER,
              boxShadow: "0 2px 8px rgba(76, 101, 132, 0.10)",
            }}
          />
        </Dropdown>
      </Header>
      <Content
        style={{
          padding: screens.xs ? "16px 4px" : "32px 64px",
          background: COLOR_BG,
          minHeight: "calc(100vh - 120px)",
        }}
      >
        <div
          style={{
            minHeight: 360,
            background: COLOR_CARD,
            borderRadius: 12,
            padding: screens.xs ? 12 : 32,
            boxShadow: "0 2px 16px rgba(76, 101, 132, 0.08)",
            color: "#222b45",
          }}
        >
          {children}
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
          background: "#d6e4f0",
          color: "#4b6584",
          fontWeight: 500,
          letterSpacing: 0.5,
          padding: screens.xs ? "16px 4px" : "24px 50px",
        }}
      >
        <div>
          <b style={{ color: COLOR_ACCENT }}>EquipMart</b> &copy; {new Date().getFullYear()} | Học viện Công nghệ Bưu
          chính Viễn thông
        </div>
        <div style={{ color: "#6d7b8a" }}>Liên hệ: support@equipmart.com | 0123.456.789</div>
      </Footer>
    </Layout>
  );
};

export default AdminLayout;
