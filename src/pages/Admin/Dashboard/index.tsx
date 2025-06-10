import React, { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import DanhMuc from "./components/DanhMuc";
import DanhSachThietBi from "./components/DanhSachThietBi";
import DaTra from "./components/DaTra";
import ThongKe from "./components/ThongKe";
import YeuCauMuon from "./components/YeuCau";
import History from "./components/History";
import DangMuon from "./components/DangMuon";
import DaDuyet from "./components/DaDuyet";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("devices");

  return (
    <AdminLayout>
      <div style={{ margin: "32px 0 16px 0" }}>
        <DanhMuc activeKey={activeTab} onChange={setActiveTab} />
      </div>
      {/* Hiển thị component theo tab */}
      {activeTab === "devices" && <DanhSachThietBi />}
      {activeTab === "borrowRequest" && <YeuCauMuon />}
      {activeTab === "return" && <DaTra />}
      {activeTab === "history" && <History />}
      {activeTab === "thongke" && <ThongKe />}
      {activeTab === "borrowed" && <DangMuon />}
      {activeTab === "approved" && <DaDuyet />}
    </AdminLayout>
  );
};

export default Dashboard;
