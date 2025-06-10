import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Descriptions, Tag, message, Input, Select, Row, Col } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  getAllBorrowRequests,
  getBorrowRequestDetail,
  manageBorrowRequest,
  confirmBorrow,
  confirmReturn,
} from "../../../../services/Admin/BorrowRequest";
import type { IBorrowRequest } from "../../../../services/Admin/BorrowRequest/typing";

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Chờ duyệt";
    case "approved":
      return "Đã duyệt";
    case "rejected":
      return "Đã từ chối";
    case "borrowed":
      return "Đã nhận";
    case "returned":
      return "Đã trả";
    default:
      return status;
  }
};

const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Đã từ chối" },
  { value: "borrowed", label: "Đã nhận" },
  { value: "returned", label: "Đã trả" },
];

const DaDuyet: React.FC = () => {
  const [data, setData] = useState<IBorrowRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<IBorrowRequest | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const token = localStorage.getItem("admin_token") || "";

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllBorrowRequests(token);
      setData(res);
    } catch (err) {
      message.error("Lỗi khi tải danh sách yêu cầu mượn");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewDetail = async (record: IBorrowRequest) => {
    try {
      const detail = await getBorrowRequestDetail(token, record._id);
      setSelected(detail);
      setAdminNotes("");
      setDetailVisible(true);
    } catch {
      message.error("Không thể lấy chi tiết yêu cầu");
    }
  };

  const handleApproveOrReject = async (status: "approved" | "rejected") => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await manageBorrowRequest(token, selected._id, { status, adminNotes });
      message.success(status === "approved" ? "Đã duyệt yêu cầu" : "Đã từ chối yêu cầu");
      setDetailVisible(false);
      fetchData();
    } catch {
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    }
    setActionLoading(false);
  };

  const handleConfirmBorrow = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await confirmBorrow(token, selected._id);
      message.success("Đã xác nhận thiết bị đã được mượn");
      setDetailVisible(false);
      fetchData();
    } catch {
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    }
    setActionLoading(false);
  };

  const handleConfirmReturn = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await confirmReturn(token, selected._id);
      message.success("Đã xác nhận thiết bị đã được trả");
      setDetailVisible(false);
      setData((prev) => prev.filter((item) => item._id !== selected._id));
      //fetchData();
    } catch {
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    }
    setActionLoading(false);
  };

  const columns: ColumnsType<IBorrowRequest> = [
    {
      title: "Người mượn",
      dataIndex: ["user", "username"],
      key: "user",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Thiết bị",
      dataIndex: ["equipment", "name"],
      key: "equipment",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Số lượng",
      dataIndex: "quantityBorrowed",
      key: "quantity",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "pending") color = "gold";
        if (status === "approved") color = "blue";
        if (status === "rejected") color = "red";
        if (status === "borrowed") color = "purple";
        if (status === "returned") color = "green";
        return <Tag color={color}>{getStatusText(status)}</Tag>;
      },
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          Xem chi tiết
        </Button>
      ),
      responsive: ["xs", "sm", "md", "lg"],
    },
  ];

  const filteredData = data
    .filter((item) => item.status === "approved")
    .filter((item) => {
      const searchText = search.trim().toLowerCase();
      const matchesSearch =
        !searchText ||
        item.user.username.toLowerCase().includes(searchText) ||
        item.equipment.name.toLowerCase().includes(searchText);
      return matchesSearch;
    });

  return (
    <div style={{ padding: 8 }}>
      <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12}>
          <Input.Search
            allowClear
            placeholder="Tìm kiếm theo người mượn hoặc thiết bị"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%" }}
          />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 8 }}
        scroll={{ x: 600 }}
        style={{ width: "100%" }}
      />

      <Modal
        open={detailVisible}
        title="Chi tiết yêu cầu mượn"
        onCancel={() => setDetailVisible(false)}
        footer={
          selected && selected.status === "pending"
            ? [
                <Input.TextArea
                  key="note"
                  rows={2}
                  placeholder="Ghi chú cho admin (nếu có)"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  style={{ marginBottom: 8 }}
                />,
                <Button key="reject" danger loading={actionLoading} onClick={() => handleApproveOrReject("rejected")}>
                  Từ chối
                </Button>,
                <Button
                  key="approve"
                  type="primary"
                  loading={actionLoading}
                  onClick={() => handleApproveOrReject("approved")}
                >
                  Duyệt
                </Button>,
              ]
            : selected && selected.status === "approved"
            ? [
                <Button key="confirmBorrow" type="primary" loading={actionLoading} onClick={handleConfirmBorrow}>
                  Xác nhận đã mượn
                </Button>,
                <Button key="close" onClick={() => setDetailVisible(false)}>
                  Đóng
                </Button>,
              ]
            : selected && selected.status === "borrowed"
            ? [
                <Button key="confirmReturn" type="primary" loading={actionLoading} onClick={handleConfirmReturn}>
                  Xác nhận đã trả
                </Button>,
                <Button key="close" onClick={() => setDetailVisible(false)}>
                  Đóng
                </Button>,
              ]
            : [
                <Button key="close" onClick={() => setDetailVisible(false)}>
                  Đóng
                </Button>,
              ]
        }
        bodyStyle={{ padding: 8, maxWidth: 400, margin: "auto" }}
        width="40%"
        style={{ top: 20 }}
      >
        {selected && (
          <Descriptions column={1} bordered size="small" style={{ wordBreak: "break-word" }}>
            <Descriptions.Item label="Người mượn">{selected.user.username}</Descriptions.Item>
            <Descriptions.Item label="Email">{selected.user.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{selected.user.phoneNumber}</Descriptions.Item>
            <Descriptions.Item label="Thiết bị">{selected.equipment.name}</Descriptions.Item>
            <Descriptions.Item label="Số lượng">{selected.quantityBorrowed}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag>{getStatusText(selected.status)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú admin">{selected.adminNotes || "Không có"}</Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">{new Date(selected.createdAt).toLocaleString()}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default DaDuyet;
