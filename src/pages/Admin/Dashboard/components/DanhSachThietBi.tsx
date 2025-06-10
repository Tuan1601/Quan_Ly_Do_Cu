import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, Popconfirm, message, Grid, Form } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import {
  getAllEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from "../../../../services/Admin/Equiment";
import { useAuthAdmin } from "../../../../contexts/Admin/AdminContext";
import instance from "../../../../config/axiosConfigUser";
import FormModal from "./FormModal";

const { useBreakpoint } = Grid;

const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await instance.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.url;
};

const DanhSachThietBi: React.FC = () => {
  const [data, setData] = useState<Equipment.IEquipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Equipment.IEquipment | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const { token } = useAuthAdmin();
  const screens = useBreakpoint();
  const [uploading, setUploading] = useState(false);

  // Fetch danh sách thiết bị
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllEquipment();
      setData(res);
    } catch {
      message.error("Không thể tải danh sách thiết bị");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Xử lý tìm kiếm
  const filteredData = data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await updateEquipment(editing._id, values, token);
        message.success("Cập nhật thiết bị thành công");
      } else {
        await createEquipment(values, token);
        message.success("Thêm thiết bị thành công");
      }
      setModalVisible(false);
      setEditing(null);
      form.resetFields();
      fetchData();
    } catch (err) {}
  };

  // Xử lý xóa thiết bị
  const handleDelete = async (id: string) => {
    try {
      await deleteEquipment(id, token);
      message.success("Xóa thiết bị thành công");
      fetchData();
    } catch {
      message.error("Xóa thiết bị thất bại");
    }
  };

  // Mở modal sửa
  const handleEdit = (record: Equipment.IEquipment) => {
    setEditing(record);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  // Mở modal thêm mới
  const handleAdd = () => {
    setEditing(null);
    setModalVisible(true);
    form.resetFields();
  };

  // Xử lý upload ảnh
  const handleUpload = async (info: any) => {
    setUploading(true);
    try {
      const file = info.file.originFileObj;
      const url = await uploadImage(file);
      form.setFieldsValue({ imageUrl: url });
      message.success("Tải ảnh lên thành công!");
    } catch {
      message.error("Tải ảnh thất bại!");
    }
    setUploading(false);
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      align: "center" as const,
      width: 80,
      render: (url: string) =>
        url ? (
          <img src={url} alt="equipment" style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 4 }} />
        ) : (
          <span style={{ color: "#aaa" }}>Không có</span>
        ),
      responsive: ["md"] as ("xxl" | "xl" | "lg" | "md" | "sm" | "xs")[],
    },
    {
      title: "Tên thiết bị",
      dataIndex: "name",
      key: "name",
      sorter: (a: Equipment.IEquipment, b: Equipment.IEquipment) => a.name.localeCompare(b.name),
      width: 180,
      ellipsis: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      responsive: ["md"] as ("xxl" | "xl" | "lg" | "md" | "sm" | "xs")[],
    },
    {
      title: "Số lượng tổng",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      align: "center" as const,
      width: 80,
    },
    {
      title: "Số lượng còn",
      dataIndex: "availableQuantity",
      key: "availableQuantity",
      align: "center" as const,
      width: 80,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      width: 100,
      render: (status: Equipment.EquipmentStatus) => {
        if (status === "available") return <span style={{ color: "#27ae60" }}>Còn</span>;
        if (status === "maintenance") return <span style={{ color: "#e67e22" }}>Bảo trì</span>;
        return <span style={{ color: "#c0392b" }}>Hỏng</span>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center" as const,
      width: 120,
      render: (_: any, record: Equipment.IEquipment) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn chắc chắn muốn xóa thiết bị này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: screens.xs ? 0 : 16 }}>
      <Space
        style={{
          marginBottom: 16,
          flexWrap: "wrap",
          width: "100%",
          justifyContent: screens.xs ? "center" : "flex-start",
        }}
      >
        <Input
          placeholder="Tìm kiếm thiết bị..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ minWidth: screens.xs ? 180 : 240 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={{ width: screens.xs ? "100%" : undefined }}
        >
          Thêm thiết bị
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        loading={loading}
        bordered
        pagination={{ pageSize: 8, showSizeChanger: true }}
        scroll={screens.xs ? { x: 600 } : undefined}
        size={screens.xs ? "small" : "middle"}
      />

      <FormModal
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => {
          setModalVisible(false);
          setEditing(null);
          form.resetFields();
        }}
        form={form}
        editing={editing}
        uploading={uploading}
        handleUpload={handleUpload}
        screens={screens}
      />
    </div>
  );
};

export default DanhSachThietBi;
