import React, { useEffect, useState } from "react";
import { Table, DatePicker, message, Card } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getMostBorrowedEquipments } from "../../../../services/Admin/ThongKe";
import dayjs from "dayjs";

interface RowData {
  equipmentId: string;
  equipmentName: string;
  description?: string;
  imageUrl?: string;
  totalTimesBorrowed: number;
  totalQuantityItemsBorrowed: number;
}

const ThongKe: React.FC = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState<number>(dayjs().month() + 1);
  const [year, setYear] = useState<number>(dayjs().year());
  const token = localStorage.getItem("admin_token") || "";

  const totalQuantitySum = data.reduce((sum, item) => sum + item.totalQuantityItemsBorrowed, 0);

  const fetchData = async (m: number, y: number) => {
    setLoading(true);
    try {
      const res = await getMostBorrowedEquipments(token, m, y);

      const mapped: RowData[] = res.map((item: any) => ({
        equipmentId: item.equipmentId || item._id,
        equipmentName: item.equipmentName || item.name,
        description: item.description,
        imageUrl: item.imageUrl,
        totalTimesBorrowed: item.totalTimesBorrowed || item.totalBorrowed,
        totalQuantityItemsBorrowed: item.totalQuantityItemsBorrowed ?? 0,
      }));
      setData(mapped);
    } catch {
      message.error("Không thể tải dữ liệu thống kê");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(month, year);
  }, [month, year]);

  const columns: ColumnsType<RowData> = [
    {
      title: "Tên thiết bị",
      dataIndex: "equipmentName",
      key: "equipmentName",
      render: (text, record) => (
        <span>
          {record.imageUrl && (
            <img src={record.imageUrl} alt={text} style={{ width: 40, marginRight: 8, borderRadius: 4 }} />
          )}
          {text}
        </span>
      ),
    },
    {
      title: "Số lần mượn",
      dataIndex: "totalTimesBorrowed",
      key: "totalTimesBorrowed",
      sorter: (a, b) => a.totalTimesBorrowed - b.totalTimesBorrowed,
    },
    {
      title: "Tổng số lượng mượn",
      dataIndex: "totalQuantityItemsBorrowed",
      key: "totalQuantityItemsBorrowed",
      sorter: (a, b) => a.totalTimesBorrowed - b.totalTimesBorrowed,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      responsive: ["md"],
    },
  ];

  return (
    <Card title="Thống kê thiết bị mượn trong tháng" style={{ marginBottom: 16 }}>
      <DatePicker
        picker="month"
        value={dayjs(`${year}-${month}`)}
        onChange={(val) => {
          if (val) {
            setMonth(val.month() + 1);
            setYear(val.year());
          }
        }}
        style={{ marginBottom: 16 }}
        format="MM/YYYY"
        placeholder="Chọn tháng"
      />
      <span
        style={{
          marginTop: 16,
          fontWeight: 500,
          fontSize: 16,
          textAlign: "right",
          marginLeft: 30,
          color: "red",
        }}
      >
        Tổng số thiết bị đã mượn: {totalQuantitySum}
      </span>
      <Table columns={columns} dataSource={data} rowKey="equipmentId" loading={loading} pagination={false} />
    </Card>
  );
};

export default ThongKe;
