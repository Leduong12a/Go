import React, { useState, useMemo, useEffect } from 'react';
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
  Empty,
  Spin,
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

// --- DỮ LIỆU TÊN CÔNG VIỆC THỰC TẾ ---
const TASK_NAMES = [
  'Sản xuất đơn Hobi-01', 'Báo cáo công nợ Tháng 9', 'Fix lỗi máy ép viền', 'Nhập nguyên liệu keo',
  'Lên mẫu thiết kế OEM', 'Thanh toán tiền điện', 'Ký hợp đồng OEM-Đại Phát', 'Duyệt KPI kinh doanh Q4',
  'Tuyển dụng thợ mộc NM', 'Lập kế hoạch sản xuất T5', 'Kiểm kê kho TP', 'Đàm phán giá phôi',
  'Bảo trì máy cắt CNC', 'Sản xuất ván ép lô B', 'Đóng gói hàng xuất khẩu', 'Thanh toán lương T4',
  'Báo cáo dòng tiền', 'Mua vật tư phụ đóng thùng', 'Chốt mẫu bàn ghế mới', 'Làm việc cục thuế',
  'Setup xưởng phụ', 'Kiểm định PCCC năm', 'Ký HĐ nhà phân phối', 'Huấn luyện An toàn LĐ',
  'Kiểm tra chất lượng gỗ', 'Nhập lô bản lề giảm chấn', 'Duyệt bảng giá đại lý', 'Tìm xưởng gia công phụ',
  'Bảo trì hệ thống hút bụi', 'Sản xuất đơn TMĐT', 'Báo cáo thuế quý 1', 'Kiểm tra công nợ KH',
  'Lên phương án QC', 'Tối ưu dây chuyền 1', 'Đánh giá NCC ván MDF', 'Họp giao ban tuần',
  'Chạy quảng cáo Tháng 4', 'Đăng ký nhãn hiệu', 'Khảo sát kho chứa mới', 'Lắp đặt máy CNC mới',
  'Phỏng vấn kế toán trưởng', 'Lập ngân sách 2026', 'Tuyển thêm 5 LĐPT', 'Xử lý khiếu nại chất lượng', 'Mở rộng kênh TMĐT'
];
const DEPARTMENTS = ['Nhà máy', 'Kế toán', 'OEM', 'Thương mại'];
const STATUSES = ['Hoàn thành', 'Đang làm', 'Quá hạn', 'Hoàn thành gia hạn 1', 'Hoàn thành gia hạn 2', 'Hoàn thành gia hạn 3'];
const OWNERS = ['Anh Tài', 'Chị Lan', 'Anh Tuấn', 'Anh Hùng', 'Chị Mai', 'Sếp Tuyển'];

// Sinh ra 1500 dữ liệu mẫu khổng lồ, rải đều ngẫu nhiên
const ALL_TASKS = Array.from({ length: 1500 }).map((_, i) => {
  const nameBase = TASK_NAMES[i % TASK_NAMES.length];

  const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
  const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
  const owner = OWNERS[Math.floor(Math.random() * OWNERS.length)];
  const weekNum = Math.floor(Math.random() * 52) + 1; // Từ tuần 1 đến tuần 52
  const priority = Math.floor(Math.random() * 4) + 1; // 1 sao đến 4 sao
  const isOverdue = status === 'Quá hạn';

  return {
    id: `task-${i + 1}`,
    name: nameBase,
    department: dept,
    status: status,
    impact: priority,
    isIssue: isOverdue || Math.random() > 0.8, // 20% khả năng bị vướng mắc
    assignee: owner,
    deadline: dayjs('2026-01-01').add(weekNum * 7 - Math.floor(Math.random() * 7), 'day').format('DD/MM/2026'),
    week: `week_${weekNum}`,
    desc: `Chi tiết công việc: ${nameBase}. Cần phối hợp với bộ phận ${dept} để xử lý dứt điểm.`,
    history: isOverdue ? 'Cảnh báo: Khách hàng / Lãnh đạo đang hối thúc!' : 'Đang theo sát tiến độ, không có vấn đề.',
  };
});

const Dashboard: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  
  const handleRowClick = (record: any) => {
    setSelectedTask(record);
  };

  // --- STATE BỘ LỌC ---
  const [filterWeek, setFilterWeek] = useState<string>('all');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredTasks = useMemo(() => {
    return ALL_TASKS.filter(task => {
      const matchWeek = filterWeek === 'all' || task.week === filterWeek;
      const matchDept = filterDept === 'all' || task.department === filterDept;
      
      let matchPriority = true;
      if (filterPriority === 'high') matchPriority = task.impact >= 3;
      if (filterPriority === 'low') matchPriority = task.impact <= 2;

      let matchStatus = true;
      if (filterStatus === 'in_progress') matchStatus = task.status === 'Đang làm';
      if (filterStatus === 'overdue') matchStatus = task.status === 'Quá hạn';
      if (filterStatus === 'completed') matchStatus = task.status === 'Hoàn thành';
      if (filterStatus === 'ext_1') matchStatus = task.status === 'Hoàn thành gia hạn 1';
      if (filterStatus === 'ext_2') matchStatus = task.status === 'Hoàn thành gia hạn 2';
      if (filterStatus === 'ext_3') matchStatus = task.status === 'Hoàn thành gia hạn 3';

      return matchWeek && matchDept && matchPriority && matchStatus;
    });
  }, [filterWeek, filterDept, filterPriority, filterStatus]);

  // --- TÁCH MẢNG CON TỪ DANH SÁCH ĐÃ LỌC ---
  const displayStats = useMemo(() => {
    return {
      total: filteredTasks.length,
      completed: filteredTasks.filter(t => t.status.includes('Hoàn thành')).length,
      overdue: filteredTasks.filter(t => t.status === 'Quá hạn').length,
      highPriority: filteredTasks.filter(t => t.impact >= 3).length,
    };
  }, [filteredTasks]);

  const displayOverdue = useMemo(() => filteredTasks.filter(t => t.status === 'Quá hạn'), [filteredTasks]);
  const displayImportant = useMemo(() => filteredTasks.filter(t => t.impact >= 3 && !t.status.includes('Hoàn thành')), [filteredTasks]);
  const displayIssues = useMemo(() => filteredTasks.filter(t => t.isIssue), [filteredTasks]);

  // --- MÀU SẮC TAG & TRẠNG THÁI ---
  const getStatusColor = (status: string) => {
    if (status === 'Hoàn thành') return 'success';
    if (status === 'Quá hạn' || status === 'Vướng mắc') return 'error';
    return 'processing';
  };

  const renderStatus = (status: string) => {
    if (status.includes('Hoàn thành')) return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">🟢 {status}</span>;
    if (status === 'Quá hạn') return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">🔴 Quá Hạn</span>;
    return <span className="px-3 py-1 bg-orange-100 text-[#F38320] rounded-full text-xs font-semibold">🟡 Đang Làm</span>;
  };

  const renderImpact = (level: number) => (
    <div className="flex gap-1">
      {[...Array(4)].map((_, i) => (
        <Star key={i} size={16} className={i < level ? 'fill-[#F38320] text-[#F38320]' : 'text-gray-300'} />
      ))}
    </div>
  );

  // Cấu hình Biểu đồ Ant Design Plots
  const chartDataRaw = useMemo(() => {
    const map: Record<string, number> = {};
    filteredTasks.forEach(t => {
      // Quy chuẩn mọi trạng thái "Hoàn thành..." về "Hoàn thành" cho biểu đồ
      const mappedStatus = t.status.includes('Hoàn thành') ? 'Hoàn thành' : t.status;
      const key = `${t.department}-${mappedStatus}`;
      map[key] = (map[key] || 0) + 1;
    });
    
    const result: any[] = [];
    const BASE_STATUSES = ['Hoàn thành', 'Đang làm', 'Quá hạn'];
    DEPARTMENTS.forEach(dept => {
      BASE_STATUSES.forEach(status => {
        result.push({ type: dept, status, value: map[`${dept}-${status}`] || 0 });
      });
    });
    return result;
  }, [filteredTasks]);

  const chartConfig = {
    data: chartDataRaw,
    xField: 'type',
    yField: 'value',
    colorField: 'status',
    group: true, // Xếp cột đứng cạnh nhau theo yêu cầu
    
    // FIX CỨNG MÀU SẮC
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
    style: {
      radiusTopLeft: 4,
      radiusTopRight: 4,
    },
  };

  const overdueColumns = [
    {
      title: 'Công việc',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Tooltip title={record.desc} placement="topLeft">
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
    { title: 'Người phụ trách', dataIndex: 'assignee', key: 'assignee' },
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
        <Tooltip title={record.desc} placement="topLeft">
          <Text strong className="text-[#fa8c16] cursor-pointer hover:underline">{text}</Text>
        </Tooltip>
      )
    },
    { title: 'Phòng ban', dataIndex: 'department', key: 'department', render: (text: string) => <Tag>{text}</Tag> },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
  ];

  const generateWeekOptions = () => {
    const weeks = [];
    let startDate = dayjs('2026-01-04');
    for (let i = 1; i <= 52; i++) {
       const endDate = startDate.add(6, 'day');
       weeks.push({
          value: `week_${i}`,
          label: `Tuần ${i} (${startDate.format('DD/MM')} - ${endDate.format('DD/MM')})`,
       });
       startDate = startDate.add(7, 'day');
    }
    return weeks;
  };

  const weekOptions = generateWeekOptions();

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6 relative">

      {/* --- BỘ LỌC TỔNG --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        <Space wrap className="mb-4 md:mb-0">
          <Select
            showSearch
            value={filterWeek}
            onChange={setFilterWeek}
            style={{ width: 220 }}
            options={[{ value: 'all', label: 'Tất cả các tuần' }, ...weekOptions]}
            placeholder="Chọn tuần làm việc"
            className="rounded-lg shadow-sm"
          />
          <Select
            value={filterDept}
            onChange={setFilterDept}
            style={{ width: 160 }}
            options={[
              { value: 'all', label: 'Tất cả phòng ban' },
              { value: 'Nhà máy', label: 'Nhà máy' },
              { value: 'OEM', label: 'OEM' },
              { value: 'Thương mại', label: 'Thương mại' },
              { value: 'Kế toán', label: 'Kế toán' },
            ]}
            className="rounded-lg"
          />
          <Select
            value={filterPriority}
            onChange={setFilterPriority}
            style={{ width: 180 }}
            options={[
              { value: 'all', label: 'Mọi mức độ' },
              { value: 'high', label: '⭐ Quan trọng (3-4)' },
              { value: 'low', label: 'Bình thường (1-2)' },
            ]}
            className="rounded-lg"
          />
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
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
      <div>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow h-full border border-gray-100">
                <Statistic title={<span className="text-gray-500 text-sm">Tổng công việc</span>} value={displayStats.total} prefix={<FileTextOutlined className="text-blue-500 mr-2" />} valueStyle={{ color: '#1e3a8a', fontSize: '24px', fontWeight: 600 }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow h-full border border-gray-100">
                <Statistic title={<span className="text-gray-500 text-sm">Đã hoàn thành</span>} value={displayStats.completed} prefix={<CheckCircleOutlined className="text-green-500 mr-2" />} valueStyle={{ color: '#10b981', fontSize: '24px', fontWeight: 600 }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow h-full border border-red-100 bg-red-50">
                <Statistic title={<span className="text-red-700 font-medium text-sm">🔴 Quá hạn nộp</span>} value={displayStats.overdue} prefix={<ClockCircleOutlined className="text-red-600 mr-2" />} valueStyle={{ color: '#dc2626', fontSize: '24px', fontWeight: 600 }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow h-full border border-orange-100 bg-orange-50">
                <Statistic title={<span className="text-orange-700 font-medium text-sm">⭐ Việc quan trọng (Mức 3-4)</span>} value={displayStats.highPriority} prefix={<FireOutlined className="text-orange-600 mr-2" />} valueStyle={{ color: '#ea580c', fontSize: '24px', fontWeight: 600 }} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="mt-6">
            {/* --- CỘT TRÁI: CÁC BẢNG DỮ LIỆU --- */}
            <Col xs={24} lg={16} className="space-y-6">
              <Card title={<span className="text-red-600"><ClockCircleOutlined className="mr-2" />🔴 DANH SÁCH VIỆC QUÁ HẠN</span>} variant="borderless" className="shadow-sm border border-red-100">
                {displayOverdue.length > 0 ? (
                  <Table
                    dataSource={displayOverdue.slice(0, 30)}
                    columns={overdueColumns}
                    pagination={false}
                    scroll={{ y: 250 }}
                    size="small"
                    rowKey="id"
                    onRow={(record) => ({ onClick: () => handleRowClick(record) })}
                  />
                ) : (
                  <Empty description="Tuyệt vời! Không có công việc nào bị quá hạn." />
                )}
              </Card>

              <Card title={<span className="text-orange-600"><FireOutlined className="mr-2" />⭐ VIỆC ẢNH HƯỞNG CAO ĐANG LÀM (MỨC 3-4)</span>} variant="borderless" className="shadow-sm border border-orange-100">
                {displayImportant.length > 0 ? (
                  <Table
                    dataSource={displayImportant.slice(0, 30)}
                    columns={importantColumns}
                    pagination={false}
                    scroll={{ y: 250 }}
                    size="small"
                    rowKey="id"
                    onRow={(record) => ({ onClick: () => handleRowClick(record) })}
                  />
                ) : (
                  <Empty description="Không có công việc quan trọng nào đang làm trong mục này." />
                )}
              </Card>

              <Card title="📊 BIỂU ĐỒ THEO PHÒNG BAN" variant="borderless" className="shadow-sm border border-gray-100">
                <div style={{ height: 250 }}>
                  <Column {...chartConfig} />
                </div>
              </Card>
            </Col>

            {/* --- CỘT PHẢI: TIMELINE VƯỚNG MẮC --- */}
            <Col xs={24} lg={8}>
              <Card
                title={<span className="text-red-600 font-bold">⚠️ CÁC CÔNG VIỆC VƯỚNG MẮC</span>}
                variant="borderless"
                className="shadow-sm h-full border border-red-100 overflow-y-auto max-h-[1000px]"
              >
                {displayIssues.length > 0 ? (
                  <Timeline
                    items={displayIssues.slice(0, 30).map(issue => ({
                      color: issue.status === 'Quá hạn' ? 'red' : 'orange',
                      children: (
                        <div 
                          className="pb-4 cursor-pointer hover:bg-gray-100 p-2 -ml-2 rounded-lg transition-colors"
                          onClick={() => handleRowClick(issue)}
                        >
                          <div className="font-bold text-[#1677ff] hover:underline text-sm mb-1">
                            {issue.name}
                          </div>
                          <p className="text-sm text-gray-600 m-0 line-clamp-2">{issue.history}</p>
                        </div>
                      ),
                    }))}
                  />
                ) : (
                  <Empty description="Mọi thứ đang suôn sẻ, không có vướng mắc nào!" />
                )}
              </Card>
            </Col>
          </Row>
      </div>

      {/* --- MODAL CHI TIẾT --- */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Header Modal */}
            <div className="bg-[#1E386B] text-white p-5 flex justify-between items-center">
              <h2 className="text-xl font-bold">{selectedTask.name}</h2>
              <button onClick={() => setSelectedTask(null)} className="hover:bg-white/20 p-1 rounded transition">
                <X size={24} />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-6 grid grid-cols-3 gap-8 overflow-y-auto">
              {/* Cột trái: Thông tin */}
              <div className="col-span-1 space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Người phụ trách</p>
                  <p className="font-semibold flex items-center gap-2"><User size={18} className="text-[#1E386B]" /> {selectedTask.assignee}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Deadline</p>
                  <p className="font-semibold flex items-center gap-2"><Calendar size={18} className="text-[#1E386B]" /> {selectedTask.deadline}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Trạng thái</p>
                  {renderStatus(selectedTask.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Mức độ ảnh hưởng</p>
                  {renderImpact(selectedTask.impact)}
                </div>
              </div>

              {/* Cột phải: Mô tả & Lịch sử */}
              <div className="col-span-2 space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-semibold text-[#1E386B] mb-2 flex items-center gap-2">Mô tả chi tiết</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedTask.desc}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-semibold text-[#1E386B] mb-2 flex items-center gap-2">Lịch sử cập nhật</h3>
                  <div className="border-l-2 border-[#F38320] pl-4 py-1 ml-2">
                    <p className="text-sm text-gray-500">Hôm qua</p>
                    <p className="text-gray-700">{selectedTask.history}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Modal: Comment */}
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