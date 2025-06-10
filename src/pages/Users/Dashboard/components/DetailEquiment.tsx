import React from "react";
import { Modal, Descriptions, Image } from "antd";

interface DetailEquimentProps {
  open: boolean;
  onClose: () => void;
  device?: Users.IEquipment | null;
}

const DetailEquiment: React.FC<DetailEquimentProps> = ({ open, onClose, device }) => {
  if (!device) return null;

  // Responsive modal width: 800px on desktop, 95vw on mobile/tablet
  const getModalWidth = () => {
    if (window.innerWidth < 600) return "95vw";
    if (window.innerWidth < 900) return "90vw";
    return 800;
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      title="Chi tiết thiết bị"
      footer={null}
      width={getModalWidth()}
      bodyStyle={{ padding: 24, maxHeight: "70vh", overflowY: "auto" }}
      style={{ top: 32 }}
      destroyOnClose
    >
      <Descriptions bordered column={1} size="middle" layout="vertical">
        <Descriptions.Item label="Tên">{device.name}</Descriptions.Item>
        <Descriptions.Item label="Số lượng">{device.totalQuantity}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">{device.status}</Descriptions.Item>
        <Descriptions.Item label="Mô tả">{device.description || "Không có"}</Descriptions.Item>
        <Descriptions.Item label="Ảnh">
          <Image
            width={window.innerWidth < 600 ? "100%" : 200}
            src={device.imageUrl || "/images/device-default.jpg"}
            style={{ maxHeight: 200, objectFit: "contain" }}
          />
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default DetailEquiment;
