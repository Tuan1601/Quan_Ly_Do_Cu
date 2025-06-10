import React, { useState } from "react";
import { Form, Input, DatePicker, Button, message, Modal } from "antd";
import { createBorrowRequest, getMyBorrowingHistory } from "../../../../services/Users/Auth/index";
import dayjs from "dayjs";

const { TextArea } = Input;

interface MuonProps {
  open: boolean;
  onClose: () => void;
  equipmentId: string;
}

const Muon: React.FC<MuonProps> = ({ open, onClose, equipmentId }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    if (!equipmentId) {
      message.error("Không xác định được thiết bị muốn mượn!");
      return;
    }
    setLoading(true);
    try {
      const history = await getMyBorrowingHistory();
      const borrowingCount = Array.isArray(history)
        ? history.filter((item) => item.status === "approved" || item.status === "borrowed").length
        : Array.isArray(history?.data)
        ? history.data.filter((item: { status: string }) => item.status === "approved" || item.status === "borrowed")
            .length
        : 0;

      if (borrowingCount >= 2) {
        message.warning("Bạn chỉ được mượn tối đa 2 thiết bị, vui lòng trả thiết bị trước khi mượn thêm!");
        setLoading(false);
        return;
      }

      await createBorrowRequest({
        equipmentId,
        quantityBorrowed: values.quantity,
        borrowDate: values.fromDate.format("YYYY-MM-DD"),
        expectedReturnDate: values.toDate.format("YYYY-MM-DD"),
        notes: values.reason,
      });
      message.success("Gửi yêu cầu mượn thành công!");
      onClose();
      form.resetFields();
    } catch (err: any) {
      message.error(err?.response?.data?.msg || err?.response?.data?.message || "Gửi yêu cầu thất bại!");
    }
    setLoading(false);
  };

  return (
    <Modal open={open} onCancel={onClose} title="Yêu cầu mượn thiết bị" footer={null} destroyOnClose>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          fromDate: dayjs(),
          toDate: dayjs().add(1, "day"),
          reason: "",
          quantity: 1,
        }}
      >
        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[
            { required: true, message: "Nhập số lượng muốn mượn" },
            { type: "number", min: 1, max: 2, message: "Chỉ được mượn tối đa 2 cái/lần" },
          ]}
        >
          <Input type="number" min={1} max={2} />
        </Form.Item>
        <Form.Item label="Ngày mượn" name="fromDate" rules={[{ required: true, message: "Chọn ngày mượn" }]}>
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="Ngày trả" name="toDate" rules={[{ required: true, message: "Chọn ngày trả" }]}>
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="Lý do mượn" name="reason" rules={[{ required: true, message: "Nhập lý do mượn" }]}>
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Gửi yêu cầu
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Muon;
