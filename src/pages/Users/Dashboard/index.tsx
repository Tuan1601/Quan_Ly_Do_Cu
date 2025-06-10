import React, { useState } from "react";
import UserLayout from "../../../layout/UserLayout";
import Banner from "./components/Banner";
import DanhMuc from "./components/DanhMuc";
import DanhSachThietBi from "./components/DSThietBi";
import ChoDuyet from "./components/ChoDuyet";
import LichSuMuon from "./components/LichSuMuon";
import DangMuon from "./components/DangMuon";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("devices");

  return (
    <UserLayout>
      <Banner />
      <div style={{ margin: "32px 0 16px 0" }}>
        <DanhMuc activeKey={activeTab} onChange={setActiveTab} />
      </div>
      {/* Hiển thị component theo tab, ví dụ chỉ demo DanhSachThietBi */}
      {activeTab === "devices" && <DanhSachThietBi />}
      {activeTab === "history" && <LichSuMuon />}
      {activeTab === "pending" && <ChoDuyet />}
      {activeTab === "borrowing" && <DangMuon />}
      {/* Các tab khác bạn có thể làm component riêng tương tự */}
    </UserLayout>
  );
};

export default Dashboard;
