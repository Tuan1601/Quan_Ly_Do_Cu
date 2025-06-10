import React from "react";
import { Tabs } from "antd";
import { AppstoreOutlined, HistoryOutlined, ClockCircleOutlined, HourglassOutlined } from "@ant-design/icons";
import "./DanhMuc.css";

// Đồng bộ màu với layout
const COLOR_TAB_BG = "#f0f4f8";
const COLOR_TAB_TEXT = "#222b45";

const items = [
  { key: "devices", label: "Danh sách thiết bị", icon: <AppstoreOutlined /> },
  { key: "pending", label: "Chờ duyệt", icon: <HourglassOutlined /> },
  { key: "borrowing", label: "Đang mượn", icon: <ClockCircleOutlined /> },
  { key: "history", label: "Lịch sử mượn", icon: <HistoryOutlined /> },
];

const DanhMuc: React.FC<{ activeKey: string; onChange: (key: string) => void }> = ({ activeKey, onChange }) => (
  <div className="danhmuc-tabs-wrapper">
    <Tabs
      activeKey={activeKey}
      onChange={onChange}
      items={items.map((item) => ({
        key: item.key,
        label: (
          <span className="danhmuc-tab-label">
            {item.icon}
            <span className="danhmuc-tab-text">{item.label}</span>
          </span>
        ),
      }))}
      tabBarStyle={{
        marginBottom: 24,
        background: COLOR_TAB_BG,
        borderRadius: 8,
        color: COLOR_TAB_TEXT,
        minHeight: 48,
        fontWeight: 500,
      }}
      tabBarGutter={0}
      animated
      className="danhmuc-tabs"
    />
  </div>
);

export default DanhMuc;
