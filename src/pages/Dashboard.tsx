import React, { useState } from 'react';
import * as Antd from 'antd';
import dayjs from 'dayjs';
const Card = Antd.Card as any;
import {
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Space,
  Select,
  Typography,
  Timeline,
  Tooltip,
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Column } from '@ant-design/plots';
import { X, User, Calendar, MessageSquare, Star } from 'lucide-react';

const { Title, Text } = Typography;

// --- DỮ LIỆU GIẢ LẬP (Mock Data) ---
const MOCK_OVERDUE_TASKS = [
  { key: '1', name: 'Sản xuất đơn Hobi-01', department: 'Nhà máy', owner: 'Anh Tài', deadline: '23/10/2026', description: 'Đơn hàng lớn xuất khẩu, đang kẹt vật tư.' },
  { key: '2', name: 'Báo cáo công nợ Tháng 9', department: 'Kế toán', owner: 'Chị Lan', deadline: '22/10/2026', description: 'Cần gấp để sếp chốt dòng tiền.' },
  { key: '3', name: 'Fix lỗi máy ép viền', department: 'Sản xuất', owner: 'Anh Tuấn', deadline: '20/10/2026', description: 'Máy số 3 đang dừng hoạt động.' },
  { key: '4', name: 'Nhập nguyên liệu keo dán', department: 'Kho', owner: 'Anh Hùng', deadline: '18/10/2026', description: 'Kho sắp cạn keo.' },
  { key: '5', name: 'Lên mẫu thiết kế OEM mới', department: 'Thiết kế', owner: 'Chị Mai', deadline: '15/10/2026', description: 'Khách hàng hối thúc bản draft.' },
  { key: '6', name: 'Thanh toán tiền điện xưởng', department: 'Kế toán', owner: 'Chị Lan', deadline: '10/10/2026', description: 'Chậm nhất ngày 12 phải đóng.' },
];
const MOCK_IMPORTANT_TASKS = [
  { key: '1', name: 'Ký hợp đồng OEM-Đại Phát', reportType: 'Đánh giá & hạn mức', status: 'Đang làm', description: 'Hợp đồng trị giá 2 tỷ.' },
  { key: '2', name: 'Duyệt KPI kinh doanh Q4', reportType: 'KPI kinh doanh', status: 'Chưa bắt đầu', description: 'Sếp Tuyển cần duyệt trước thứ 6.' },
];

const Dashboard: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const renderStatus = (status: string) => {
    switch (status) {
      case 'Hoàn thành': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">🟢 Hoàn Thành</span>;
      case 'Trễ hạn':
      case 'Vướng mắc': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">🔴 Vướng Mắc</span>;
      default: return <span className="px-3 py-1 bg-orange-100 text-[#F38320] rounded-full text-xs font-semibold">🟡 Đang Làm</span>;
    }
  };

  const renderImpact = (level: number) => (
    <div className="flex gap-1">
      {[...Array(4)].map((_, i) => (
        <Star key={i} size={16} className={i < level ? 'fill-[#F38320] text-[#F38320]' : 'text-gray-300'} />
      ))}
    </div>
  );

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

  // --- CẤU HÌNH BIỂU ĐỒ ĐÃ FIX CỨNG V2 ---
  const chartConfig = {
    data: chartData,
    xField: 'type',
    yField: 'value',
    colorField: 'status',
    // CHUYỂN TỪ STACK SANG GROUP (ĐỨNG CẠNH NHAU)
    group: true,
    style: {
      radiusTopLeft: 4,
      radiusTopRight: 4,
    },

    // FIX CỨNG 3 MÀU: Xanh lá (Hoàn thành) - Cam (Đang làm) - Đỏ (Quá hạn)
    scale: {
      color: {
        domain: ['Hoàn thành', 'Đang làm', 'Quá hạn'],
        range: ['#10b981', '#fa8c16', '#ef4444'],
      },
    },

    label: {
      text: 'value',
      position: 'inside',
      style: {
        fill: '#fff',
        fontWeight: 'bold',
      }
    },
  };

  const handleRowClick = (record: any) => {
    setSelectedTask(record);
  };

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

  const generateWeekOptions = () => {
    const weeks = [];
    let startDate = dayjs('2026-01-04');

    for (let i = 1; i <= 52; i++) {
      const endDate = startDate.add(7, 'day');
      weeks.push({
        value: `week_${i}`,
        label: `Tuần ${i} (${startDate.format('DD/MM')} - ${endDate.format('DD/MM')})`,
      });
      startDate = endDate;
    }
    return weeks;
  };

  const weekOptions = generateWeekOptions();

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">

      {/* --- BỘ LỌC TỔNG --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        {/* <Title level={5} className="m-0">Command Center</Title> */}
        <Space wrap className="mb-4">
          <Select
            showSearch
            defaultValue="week_16"
            style={{ width: 220 }}
            options={weekOptions}
            placeholder="Chọn tuần làm việc"
            className="rounded-lg shadow-sm"
          />
          <Select
            defaultValue="all"
            style={{ width: 160 }}
            options={[
              { value: 'all', label: 'Tất cả phòng ban' },
              { value: 'factory', label: 'Nhà máy' },
              { value: 'oem', label: 'OEM' },
              { value: 'project', label: 'Dự án' },
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
          <Select
            defaultValue="all"
            style={{ width: 220 }}
            options={[
              { value: 'all', label: 'Tất cả tiến độ' },
              { value: 'in_progress', label: ' Đang Làm' },
              { value: 'overdue', label: ' Quá Hạn' },
              { value: 'completed', label: ' Hoàn Thành' },
              { value: 'ext_1', label: ' Hoàn Thành Gia Hạn 1' },
              { value: 'ext_2', label: ' Hoàn Thành Gia Hạn 2' },
              { value: 'ext_3', label: ' Hoàn Thành Gia Hạn 3' },
            ]}
            className="rounded-lg border-orange-400"
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
          <Card title={<span className="text-red-600"><ClockCircleOutlined className="mr-2" />🔴 DANH SÁCH VIỆC QUÁ HẠN</span>} variant="borderless" className="shadow-sm border border-red-100">
            <Table
              dataSource={MOCK_OVERDUE_TASKS}
              columns={overdueColumns}
              pagination={false}
              size="small"
              scroll={{ y: 250 }}
              onRow={(record) => ({ onClick: () => handleRowClick(record) })}
            />
          </Card>

          <Card title={<span className="text-orange-600"><FireOutlined className="mr-2" />⭐ VIỆC ẢNH HƯỞNG CAO (MỨC 3-4)</span>} variant="borderless" className="shadow-sm border border-orange-100">
            <Table
              dataSource={MOCK_IMPORTANT_TASKS}
              columns={importantColumns}
              pagination={false}
              size="small"
              onRow={(record) => ({ onClick: () => handleRowClick(record) })}
            />
          </Card>

          <Card title="📊 BIỂU ĐỒ THEO PHÒNG BAN" variant="borderless" className="shadow-sm border border-gray-100">
            <div style={{ height: 250 }}>
              <Column {...chartConfig} />
            </div>
          </Card>
        </Col>

        {/* --- CỘT PHẢI: LỊCH HÔM NAY --- */}
        <Col xs={24} lg={8}>
          <Card
            title={<span className="text-red-600 font-bold">⚠️ CÁC CÔNG VIỆC VƯỚNG MẮC</span>}
            variant="borderless"
            className="shadow-sm h-full border border-red-100"
          >


            <Timeline
              items={[
                {
                  color: 'red',
                  children: (
                    <div className="pb-4">
                      <div
                        className="font-bold text-[#1677ff] cursor-pointer hover:underline text-sm"
                        onClick={() => handleRowClick({
                          name: 'Sản xuất đơn Hobi-01',
                          assignee: 'Anh Tài',
                          deadline: '2026-04-23',
                          status: 'Vướng mắc',
                          impact: 4,
                          desc: 'Kho báo thiếu 20% vật tư keo dán công nghiệp từ nhà cung cấp, ảnh hưởng tiến độ đóng gói lô hàng xuất khẩu.',
                          history: 'Đã liên hệ nhà cung cấp dự phòng, chờ xác nhận giao hàng.'
                        })}
                      >
                        Sản xuất đơn Hobi-01
                      </div>
                      <p className="text-sm text-gray-600 m-0 mt-1 line-clamp-1">Thiếu 20% keo dán từ nhà cung cấp.</p>
                    </div>
                  ),
                },
                {
                  color: 'red',
                  children: (
                    <div className="pb-4">
                      <div
                        className="font-bold text-[#1677ff] cursor-pointer hover:underline text-sm"
                        onClick={() => handleRowClick({
                          name: 'Fix lỗi máy ép viền',
                          assignee: 'Anh Tuấn',
                          deadline: '2026-04-10',
                          status: 'Vướng mắc',
                          impact: 3,
                          desc: 'Máy số 3 hỏng bo mạch điều khiển, chưa nhập được linh kiện thay thế từ nước ngoài.',
                          history: 'Thiếu nhân sự kỹ thuật, đang chờ linh kiện về.'
                        })}
                      >
                        Fix lỗi máy ép viền
                      </div>
                      <p className="text-sm text-gray-600 m-0 mt-1 line-clamp-1">Chưa nhập được linh kiện thay thế.</p>
                    </div>
                  ),
                },
                {
                  color: 'orange',
                  children: (
                    <div className="pb-4">
                      <div
                        className="font-bold text-[#1677ff] cursor-pointer hover:underline text-sm"
                        onClick={() => handleRowClick({
                          name: 'Ký hợp đồng OEM-Đại Phát',
                          assignee: 'Chị Mai',
                          deadline: '2026-04-28',
                          status: 'Đang làm',
                          impact: 3,
                          desc: 'Khách hàng đang yêu cầu đàm phán lại điều khoản thanh toán từ 30 ngày lên 45 ngày.',
                          history: 'Đã gửi email phản hồi, chờ bộ phận pháp lý xem xét.'
                        })}
                      >
                        Ký hợp đồng OEM-Đại Phát
                      </div>
                      <p className="text-sm text-gray-600 m-0 mt-1 line-clamp-1">Khách đòi đổi điều khoản công nợ.</p>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* --- MODAL CHI TIẾT VƯỚNG MẮC --- */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Header */}
            <div className="bg-[#1E386B] text-white p-5 flex justify-between items-center">
              <h2 className="text-xl font-bold">{selectedTask.name}</h2>
              <button onClick={() => setSelectedTask(null)} className="hover:bg-white/20 p-1 rounded transition">
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 grid grid-cols-3 gap-8 overflow-y-auto">
              {/* Cột trái: Thông tin */}
              <div className="col-span-1 space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Người phụ trách</p>
                  <p className="font-semibold flex items-center gap-2"><User size={18} className="text-[#1E386B]" /> {selectedTask.assignee || selectedTask.owner || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Deadline</p>
                  <p className="font-semibold flex items-center gap-2"><Calendar size={18} className="text-[#1E386B]" /> {selectedTask.deadline || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Trạng thái</p>
                  {renderStatus(selectedTask.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Mức độ ảnh hưởng</p>
                  {renderImpact(selectedTask.impact || 3)}
                </div>
              </div>

              {/* Cột phải: Mô tả & Lịch sử */}
              <div className="col-span-2 space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-semibold text-[#1E386B] mb-2">Mô tả chi tiết</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedTask.desc || selectedTask.description}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-semibold text-[#1E386B] mb-2">Lịch sử cập nhật</h3>
                  <div className="border-l-2 border-[#F38320] pl-4 py-1 ml-2">
                    <p className="text-sm text-gray-500">Hôm qua</p>
                    <p className="text-gray-700">{selectedTask.history || 'Chưa có cập nhật.'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Comment */}
            <div className="border-t border-gray-200 p-5 bg-gray-50 flex items-start gap-3">
              <MessageSquare className="text-gray-400 mt-2" size={20} />
              <div className="flex-1">
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#F38320] focus:ring-1 focus:ring-[#F38320] transition resize-none text-sm"
                  rows={2}
                  placeholder="Thêm bình luận, chỉ đạo hoặc cập nhật trạng thái..."
                />
                <div className="flex justify-end mt-2">
                  <button className="bg-[#F38320] text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition text-sm">
                    Gửi
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;