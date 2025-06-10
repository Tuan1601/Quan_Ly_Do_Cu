import React from "react";
import { Modal, Form, Input, InputNumber, Select, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

interface FormModalProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  form: any;
  editing: any;
  uploading: boolean;
  handleUpload: (info: any) => void;
  screens: any;
}

const FormModal: React.FC<FormModalProps> = ({
  open,
  onOk,
  onCancel,
  form,
  editing,
  uploading,
  handleUpload,
  screens,
}) => (
  <Modal
    title={editing ? "Cập nhật thiết bị" : "Thêm thiết bị mới"}
    open={open}
    onOk={onOk}
    onCancel={onCancel}
    destroyOnClose
    okText={editing ? "Cập nhật" : "Thêm mới"}
    cancelText="Hủy"
    width={screens.xs ? "98vw" : 480}
    style={{ top: screens.xs ? 10 : 50 }}
    bodyStyle={{ padding: screens.xs ? 8 : 24 }}
  >
    <Form form={form} layout="vertical" initialValues={{ status: "available" }} style={{ width: "100%" }}>
      <Form.Item label="Tên thiết bị" name="name" rules={[{ required: true, message: "Vui lòng nhập tên thiết bị" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Mô tả" name="description">
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item
        label="Số lượng tổng"
        name="totalQuantity"
        rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
      >
        <InputNumber min={1} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="URL ảnh thiết bị"
        name="imageUrl"
        rules={[
          { required: true, message: "Vui lòng nhập URL ảnh" },
          { type: "url", message: "URL không hợp lệ" },
        ]}
      >
        <Input placeholder="Nhập URL ảnh thiết bị" />
      </Form.Item>
      {/* <Form.Item label="Ảnh thiết bị" name="imageUrl" valuePropName="imageUrl">
        <Upload
          name="file"
          listType="picture"
          maxCount={1}
          showUploadList={{
            showPreviewIcon: false,
            showRemoveIcon: true,
          }}
          beforeUpload={() => false}
          customRequest={handleUpload}
          accept="image/*"
          disabled={uploading}
        >
          <Button icon={<UploadOutlined />} loading={uploading}>
            Chọn ảnh
          </Button>
        </Upload>
      </Form.Item> */}
      <Form.Item label="Trạng thái" name="status">
        <Select>
          <Option value="available">Còn</Option>
          <Option value="maintenance">Bảo trì</Option>
          <Option value="unavailable">Hỏng</Option>
        </Select>
      </Form.Item>
    </Form>
  </Modal>
);

export default FormModal;
