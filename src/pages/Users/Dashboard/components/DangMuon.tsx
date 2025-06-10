import React, { useEffect, useState } from "react";
import { List, Card, Tag, Spin, Empty, Button, Modal, Descriptions } from "antd";
import { getMyBorrowingHistory } from "../../../../services/Users/Auth/index";
import dayjs from "dayjs";
import { EyeOutlined } from "@ant-design/icons";

const statusColor: Record<string, string> = {
  pending: "orange",
  approved: "green",
  rejected: "red",
  returned: "blue",
};

const statusText: Record<string, string> = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
  returned: "Đã trả",
};

const DangMuon: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getMyBorrowingHistory();
        if (Array.isArray(res)) {
          setHistory(res);
        } else if (res && Array.isArray(res.data)) {
          setHistory(res.data);
        } else {
          setHistory([]);
        }
      } catch {
        setHistory([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Spin spinning={loading}>
      <Card title="Đang mượn" style={{ margin: 0 }}>
        {history.filter((item) => item.status === "approved" || item.status === "borrowed").length === 0 ? (
          <Empty description="Không có thiết bị nào được mượn" />
        ) : (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
            dataSource={history.filter((item) => item.status === "approved" || item.status === "borrowed")}
            renderItem={(item) => (
              <List.Item key={item._id}>
                <Card
                  size="small"
                  style={{ minHeight: 170, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                  bodyStyle={{ padding: 16 }}
                >
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>{item.equipment?.name || "Không rõ"}</div>
                    <div style={{ marginBottom: 4 }}>
                      <Tag color={statusColor[item.status] || "default"}>{statusText[item.status] || item.status}</Tag>
                    </div>
                    <div style={{ fontSize: 13, color: "#888" }}>
                      Ngày mượn: {item.borrowDate ? dayjs(item.borrowDate).format("DD/MM/YYYY") : "--"}
                    </div>
                  </div>
                  <Button
                    icon={<EyeOutlined />}
                    size="small"
                    style={{ marginTop: 12, borderRadius: 16, fontWeight: 500 }}
                    onClick={() => {
                      setSelected(item);
                      setModalOpen(true);
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </Card>
              </List.Item>
            )}
          />
        )}

        <Modal
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          footer={null}
          title="Chi tiết mượn thiết bị"
          centered
        >
          {selected && (
            <Descriptions column={1} bordered size="middle">
              <Descriptions.Item label="Thiết bị">{selected.equipment?.name || "Không rõ"}</Descriptions.Item>
              <Descriptions.Item label="Số lượng">{selected.quantityBorrowed}</Descriptions.Item>
              <Descriptions.Item label="Ngày mượn">
                {selected.borrowDate ? dayjs(selected.borrowDate).format("DD/MM/YYYY") : "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày trả dự kiến">
                {selected.expectedReturnDate ? dayjs(selected.expectedReturnDate).format("DD/MM/YYYY") : "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Lý do">{selected.notes || "--"}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={statusColor[selected.status] || "default"}>
                  {statusText[selected.status] || selected.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </Card>
    </Spin>
  );
};

export default DangMuon;
