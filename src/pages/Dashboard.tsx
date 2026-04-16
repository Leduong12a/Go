import React, { useState } from 'react';
import * as Antd from 'antd';
const Card = Antd.Card as any;
import {
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Rate,
  Space,
  Select,
  DatePicker,
  Typography,
  Timeline,
  Drawer,
  Avatar,
  Tooltip,
  Input,
  Badge,
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  FileTextOutlined,
  UserOutlined,
  SearchOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { Column } from '@ant-design/plots';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// --- DỮ LIỆU GIẢ LẬP (Mock Data) ĐỂ CHẠY LUÔN KHÔNG LỖI ---
const MOCK_OVERDUE_TASKS = [
  { key: '1', name: 'Sản xuất đơn Hobi-01', department: 'Nhà máy', owner: 'Anh Tài', deadline: '23/10/2026', description: 'Đơn hàng lớn xuất khẩu, đang kẹt vật tư.' },
  { key: '2', name: 'Báo cáo công nợ Tháng 9', department: 'Kế toán', owner: 'Chị Lan', deadline: '22/10/2026', description: 'Cần gấp để sếp chốt dòng tiền.' },
  { key: '3', name: 'Fix lỗi máy ép viền', department: 'Sản xuất', owner: 'Anh Tuấn', deadline: '20/10/2026', description: 'Máy số 3 đang dừng hoạt động.' },
];

const MOCK_IMPORTANT_TASKS = [
  { key: '1', name: 'Ký hợp đồng OEM-Đại Phát', reportType: 'Đánh giá & hạn mức', status: 'Đang làm', description: 'Hợp đồng trị giá 2 tỷ.' },
  { key: '2', name: 'Duyệt KPI kinh doanh Q4', reportType: 'KPI kinh doanh', status: 'Chưa bắt đầu', description: 'Sếp Tuyển cần duyệt trước thứ 6.' },
];

const Dashboard: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const chartData = [
    { type: 'Nhà máy', status: 'Hoàn thành', value: 45 },
    { type: 'Nhà máy', status: 'Đang làm', value: 25 },
    { type: 'Nhà máy', status: 'Quá hạn', value: 10 },
    { type: 'OEM', status: 'Hoàn thành', value: 30 },
    { type: 'OEM', status: 'Đang làm', value: 40 },
    { type: 'OEM', status: 'Quá hạn', value: 15 },
    { type: 'Thương mại', status: 'Hoàn thành', value: 60 },
    { type: 'Thương mại', status: 'Đang làm', value: 10 },
    { type: 'Thương mại', status: 'Quá hạn', value: 5 },
  ];

  const chartConfig = {
    data: chartData,
    isStack: true,
    xField: 'type',
    yField: 'value',
    seriesField: 'status',
    color: ['#10b981', '#3b82f6', '#ef4444'], // Xanh - Xanh dương - Đỏ
    label: {
      position: 'inside',
      layout: [{ type: 'interval-adjust-position' }, { type: 'interval-hide-overlap' }, { type: 'adjust-color' }],
    },
  };

  const handleRowClick = (record: any) => {
    setSelectedTask(record);
    setDrawerVisible(true);
  };

  // 1. CỘT BẢNG QUÁ HẠN (Chuẩn đặc tả: Công việc | Phòng ban | Phụ trách | Deadline)
  const overdueColumns = [
    {
      title: 'Công việc',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Tooltip title={record.description} placement="topLeft">
          <Text strong className="text-red-600 cursor-pointer hover:underline">{text}</Text>
        </Tooltip>
      )
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
      render: (text: string) => <Tag>{text}</Tag>
    },
    { title: 'Người phụ trách', dataIndex: 'owner', key: 'owner' },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (date: string) => <Tag color="error">{date}</Tag>
    },
  ];

  // 2. CỘT BẢNG QUAN TRỌNG (Chuẩn đặc tả: Công việc | Thuộc báo cáo | Trạng thái)
  const importantColumns = [
    {
      title: 'Công việc (⭐)',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Tooltip title={record.description} placement="topLeft">
          <Text strong className="text-[#fa8c16] cursor-pointer hover:underline">{text}</Text>
        </Tooltip>
      )
    },
    { title: 'Thuộc báo cáo', dataIndex: 'reportType', key: 'reportType' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = status === 'Đang làm' ? 'processing' : 'warning';
        return <Tag color={color}>{status}</Tag>;
      }
    },
  ];

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">

      {/* --- HEADER CHUẨN ĐẶC TẢ --- */}
      {/* <Row justify="space-between" align="middle" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <Col className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-800 rounded-md flex items-center justify-center text-white font-bold">H</div>
          <Title level={4} className="m-0 text-blue-900" style={{ margin: 0 }}>Hobiwood System</Title>
        </Col>
        <Col className="flex items-center space-x-6">
          <Input prefix={<SearchOutlined className="text-gray-400" />} placeholder="Tìm kiếm báo cáo..." className="rounded-full w-64" />
          <Badge count={3} size="small">
            <BellOutlined className="text-xl cursor-pointer text-gray-600 hover:text-blue-600" />
          </Badge>
          <div className="flex items-center cursor-pointer">
            <Avatar icon={<UserOutlined />} className="bg-blue-500 mr-2" />
            <Text strong>Sếp Tuyển</Text>
          </div>
        </Col>
      </Row> */}

      {/* --- BỘ LỌC TỔNG (Đã thêm Mức độ ảnh hưởng) --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        <Title level={5} className="m-0">Command Center</Title>
        <Space wrap>
          <RangePicker className="rounded-lg" />
          <Select
            defaultValue="all"
            style={{ width: 160 }}
            options={[
              { value: 'all', label: 'Tất cả phòng ban' },
              { value: 'factory', label: 'Nhà máy' },
              { value: 'oem', label: 'OEM' },
            ]}
            className="rounded-lg"
          />
          <Select
            defaultValue="all"
            style={{ width: 180 }}
            options={[
              { value: 'all', label: 'Mọi mức độ' },
              { value: 'high', label: '⭐ Quan trọng (3-4)' },
              { value: 'low', label: 'Bình thường (1-2)' },
            ]}
            className="rounded-lg"
          />
        </Space>
      </div>

      {/* --- KPI TỔNG QUAN --- */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow h-full border border-gray-100">
            <Statistic title={<span className="text-gray-500 text-sm">Tổng công việc</span>} value={1284} prefix={<FileTextOutlined className="text-blue-500 mr-2" />} valueStyle={{ color: '#1e3a8a', fontSize: '24px', fontWeight: 600 }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow h-full border border-gray-100">
            <Statistic title={<span className="text-gray-500 text-sm">Đã hoàn thành</span>} value={842} prefix={<CheckCircleOutlined className="text-green-500 mr-2" />} valueStyle={{ color: '#10b981', fontSize: '24px', fontWeight: 600 }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow h-full border border-red-100 bg-red-50">
            <Statistic title={<span className="text-red-700 font-medium text-sm">🔴 Quá hạn nộp</span>} value={12} prefix={<ClockCircleOutlined className="text-red-600 mr-2" />} valueStyle={{ color: '#dc2626', fontSize: '24px', fontWeight: 600 }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow h-full border border-orange-100 bg-orange-50">
            <Statistic title={<span className="text-orange-700 font-medium text-sm">⭐ Việc quan trọng (Mức 3-4)</span>} value={5} prefix={<FireOutlined className="text-orange-600 mr-2" />} valueStyle={{ color: '#ea580c', fontSize: '24px', fontWeight: 600 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* --- CỘT TRÁI: CÁC BẢNG DỮ LIỆU --- */}
        <Col xs={24} lg={16} className="space-y-6">

          {/* Bảng 1: Quá hạn */}
          <Card title={<span className="text-red-600"><ClockCircleOutlined className="mr-2" />🔴 TOP 5 VIỆC QUÁ HẠN</span>} variant="borderless" className="shadow-sm border border-red-100">
            <Table
              dataSource={MOCK_OVERDUE_TASKS}
              columns={overdueColumns}
              pagination={false}
              size="small"
              onRow={(record) => ({ onClick: () => handleRowClick(record) })}
            />
          </Card>

          {/* Bảng 2: Việc quan trọng (Đã bổ sung) */}
          <Card title={<span className="text-orange-600"><FireOutlined className="mr-2" />⭐ VIỆC ẢNH HƯỞNG CAO (MỨC 3-4)</span>} variant="borderless" className="shadow-sm border border-orange-100">
            <Table
              dataSource={MOCK_IMPORTANT_TASKS}
              columns={importantColumns}
              pagination={false}
              size="small"
              onRow={(record) => ({ onClick: () => handleRowClick(record) })}
            />
          </Card>

          {/* Biểu đồ (Đã gom vào cột trái cho cân đối) */}
          <Card title="📊 BIỂU ĐỒ THEO PHÒNG BAN" variant="borderless" className="shadow-sm border border-gray-100">
            <div style={{ height: 250 }}>
              <Column {...chartConfig} />
            </div>
          </Card>
        </Col>

        {/* --- CỘT PHẢI: LỊCH HÔM NAY --- */}
        <Col xs={24} lg={8}>
          <Card title="📅 LỊCH BÁO CÁO HÔM NAY" variant="borderless" className="shadow-sm h-full border border-gray-100">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center mb-6">
              <div className="text-lg font-bold text-blue-800">Thứ Năm, 16/04/2026</div>
              <div className="text-sm text-blue-600 mt-1">Sếp có 03 báo cáo cần xem xét hôm nay</div>
            </div>

            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <div className="pb-4">
                      <Text strong>Báo cáo tháng NM</Text>
                      <p className="text-xs text-gray-500 m-0">Đã nộp lúc 08:30 sáng</p>
                    </div>
                  ),
                },
                {
                  color: 'red',
                  children: (
                    <div className="pb-4">
                      <Text strong className="text-red-500">Công nợ OEM</Text>
                      <p className="text-xs text-gray-500 m-0">Quá hạn nộp 2 ngày</p>
                    </div>
                  ),
                },
                {
                  color: 'orange',
                  children: (
                    <div className="pb-4">
                      <Text strong>Báo cáo tuần KD</Text>
                      <p className="text-xs text-gray-500 m-0">Deadline: 17:00 chiều nay</p>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* --- POPUP CHI TIẾT (Giữ nguyên logic của bạn) --- */}
      <Drawer
        title="Chi tiết công việc"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
      >
        {selectedTask && (
          <div className="space-y-4">
            <div>
              <Text type="secondary">Tên công việc</Text>
              <Title level={4}>{selectedTask.name}</Title>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Text type="secondary">Người phụ trách</Text>
                <div className="flex items-center mt-1">
                  <Avatar icon={<UserOutlined />} size="small" className="mr-2" />
                  <Text strong>{selectedTask.owner || 'Chưa cập nhật'}</Text>
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Hạn chót / Trạng thái</Text>
                <div className="mt-1">
                  <Tag color={selectedTask.deadline ? "error" : "processing"}>
                    {selectedTask.deadline || selectedTask.status}
                  </Tag>
                </div>
              </Col>
            </Row>
            <div className="pt-4 border-t">
              <Text strong>Mô tả chi tiết</Text>
              <p className="text-gray-600 mt-2">
                {selectedTask.description}
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Dashboard;