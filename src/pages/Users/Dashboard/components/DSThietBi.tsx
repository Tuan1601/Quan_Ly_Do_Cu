import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Tag, Spin, Pagination, Empty, message, Input, Select } from "antd";
import { getEquipment } from "../../../../services/Users/Auth/index";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../../../../contexts/Users/UserContext";
import DetailEquiment from "./DetailEquiment";
import Muon from "./Muon";

const statusVi: Record<string, string> = {
  available: "Còn",
  borrowed: "Đang mượn",
  broken: "Hỏng",
  maintenance: "Bảo trì",
  Còn: "Còn",
  "Đang mượn": "Đang mượn",
  Hỏng: "Hỏng",
  "Bảo trì": "Bảo trì",
};

const statusColor: Record<string, string> = {
  Còn: "green",
  "Đang mượn": "orange",
  Hỏng: "red",
  "Bảo trì": "blue",
};

const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "Còn", label: "Còn" },
  { value: "Đang mượn", label: "Đang mượn" },
  { value: "Hỏng", label: "Hỏng" },
  { value: "Bảo trì", label: "Bảo trì" },
];

const PAGE_SIZE = 8;

const DanhSachThietBi: React.FC = () => {
  const [devices, setDevices] = useState<Users.IEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthUser();

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Users.IEquipment | null>(null);

  const [muonOpen, setMuonOpen] = useState(false);
  const [muonEquipmentId, setMuonEquipmentId] = useState<string | null>(null);

  const fetchDevices = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await getEquipment({ page: pageNum, pageSize: PAGE_SIZE });
      if (res && typeof res === "object" && "data" in res && Array.isArray((res as any).data)) {
        setDevices((res as any).data);
        setTotal((res as any).total || (res as any).data.length);
      } else if (Array.isArray(res)) {
        setDevices(res);
        setTotal(res.length);
      } else {
        setDevices([]);
        setTotal(0);
      }
    } catch {
      setDevices([]);
      setTotal(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDevices(page);
  }, [page]);

  const handlePageChange = (p: number) => setPage(p);

  const handleBorrow = (id: string) => {
    if (!isAuthenticated) {
      message.info("Bạn cần đăng nhập để mượn thiết bị!");
      navigate("/login");
      return;
    }
    setMuonEquipmentId(id);
    setMuonOpen(true);
  };

  const handleShowDetail = (device: Users.IEquipment) => {
    setSelectedDevice(device);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedDevice(null);
  };

  const handleCloseMuon = () => {
    setMuonOpen(false);
    setMuonEquipmentId(null);
  };

  // Lọc thiết bị theo tên và trạng thái
  const filteredDevices = (Array.isArray(devices) ? devices : []).filter((device) => {
    const statusText = statusVi[device.status] || device.status || "Không rõ";
    const matchesSearch = !search.trim() || device.name.toLowerCase().includes(search.trim().toLowerCase());
    const matchesStatus = !statusFilter || statusText === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Spin spinning={loading}>
      <div style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Input.Search
          allowClear
          placeholder="Tìm kiếm theo tên thiết bị"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 240 }}
        />
        <Select
          allowClear
          style={{ width: 180 }}
          placeholder="Lọc theo trạng thái"
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          options={statusOptions}
        />
      </div>
      <Row gutter={[24, 24]}>
        {filteredDevices.length === 0 && !loading && (
          <Col span={24}>
            <Empty description="Không có thiết bị nào" />
          </Col>
        )}
        {filteredDevices.map((device) => {
          const statusText = statusVi[device.status] || device.status || "Không rõ";
          return (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={device._id} style={{ display: "flex" }}>
              <Card
                className="equipment-card"
                hoverable
                cover={
                  <img
                    alt={device.name}
                    src={device.imageUrl || "/images/device-default.jpg"}
                    style={{ height: 160, objectFit: "cover" }}
                  />
                }
                style={{
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  width: "100%",
                  minWidth: 0,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                <Card.Meta
                  title={
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {device.name}
                      <Tag color={statusColor[statusText] || "default"}>{statusText}</Tag>
                    </div>
                  }
                  description={
                    <>
                      <div>
                        Số lượng:{" "}
                        {typeof device.totalQuantity === "number"
                          ? device.totalQuantity
                          : device.totalQuantity !== undefined
                          ? device.totalQuantity
                          : "Không rõ"}
                      </div>
                      {device.description && <div style={{ marginTop: 4, color: "#888" }}>{device.description}</div>}
                    </>
                  }
                />
                <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <Button size="small" onClick={() => handleShowDetail(device)}>
                    Xem chi tiết
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    disabled={statusText !== "Còn"}
                    onClick={() => device._id && handleBorrow(device._id)}
                  >
                    Mượn
                  </Button>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
      <div style={{ marginTop: 32, width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <Pagination
          current={page}
          pageSize={PAGE_SIZE}
          total={total}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
      {/* Modal chi tiết thiết bị */}
      <DetailEquiment open={detailOpen} onClose={handleCloseDetail} device={selectedDevice} />
      {/* Modal mượn thiết bị */}
      {muonEquipmentId && <Muon open={muonOpen} onClose={handleCloseMuon} equipmentId={muonEquipmentId} />}
    </Spin>
  );
};

export default DanhSachThietBi;
