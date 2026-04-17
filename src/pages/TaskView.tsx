import React, { useState } from 'react';
import { Tree, Typography, Tag, Dropdown, message, Select } from 'antd';
import type { TreeProps } from 'antd';
import {
  FolderOutlined,
  CheckSquareOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Star } from 'lucide-react';
import dayjs from 'dayjs';

const { Text } = Typography;

// ─── GENERATE 52 TUẦN ────────────────────────────────────────────────────────
const generateWeeks = () => {
  const weeks = [];
  let start = dayjs('2026-01-04'); // Chủ nhật đầu tiên
  for (let i = 1; i <= 52; i++) {
    const end = start.add(6, 'day');
    weeks.push({
      value: `week_${i}`,
      label: `Tuần ${i}  (${start.format('DD/MM')} - ${end.format('DD/MM')})`,
    });
    start = start.add(7, 'day');
  }
  return weeks;
};
const WEEK_OPTIONS = generateWeeks();

// ─── DỮ LIỆU ĐẦY ĐỦ 14 TRƯỜNG ────────────────────────────────────────────────
const ALL_TASKS: Record<string, any> = {
  'nm-1': {
    stt: 1,
    congViec: 'Sản xuất đơn hàng ván sàn A',
    nguoiGiao: 'Anh Tài',
    ngayGiao: '14/04/2026',
    ycXong: '23/04/2026',
    giaHan1: '25/04/2026',
    giaHan2: '28/04/2026',
    giaHan3: '30/04/2026',
    ketQua: 'Đã sản xuất xong 500m2',
    linkKQ: 'https://docs.google.com/hang-a',
    tienDo: 'Hoàn thành',
    vuongMac: 'Giao hàng bị chậm do xe tải hỏng',
    canLD: 'Không',
    anhHuong: 4,
  },
  'nm-2': {
    stt: 2,
    congViec: 'Fix lỗi ván ép lô B',
    nguoiGiao: 'Anh Tuấn',
    ngayGiao: '01/04/2026',
    ycXong: '07/04/2026',
    giaHan1: '10/04/2026',
    giaHan2: '14/04/2026',
    giaHan3: '16/04/2026',
    ketQua: 'Tháo dỡ máy ép số 2',
    linkKQ: 'https://docs.google.com/lo-b',
    tienDo: 'Quá hạn',
    vuongMac: 'Thiếu linh kiện thay thế',
    canLD: 'Có',
    anhHuong: 3,
  },
  'nm-3': {
    stt: 3,
    congViec: 'Bảo trì máy nghiền gỗ',
    nguoiGiao: 'Chú Hải',
    ngayGiao: '01/04/2026',
    ycXong: '10/04/2026',
    giaHan1: '15/04/2026',
    giaHan2: '18/04/2026',
    giaHan3: '22/04/2026',
    ketQua: 'Đã hoàn thiện phần cơ khí',
    linkKQ: 'https://docs.google.com/bao-tri',
    tienDo: 'Quá hạn',
    vuongMac: 'Đội bảo trì đang rút đi sửa chữa gấp chỗ khác',
    canLD: 'Có',
    anhHuong: 4,
  },
  'nm-4': {
    stt: 4,
    congViec: 'Lên kế hoạch sản xuất tháng 5',
    nguoiGiao: 'Anh Tuyển',
    ngayGiao: '14/04/2026',
    ycXong: '28/04/2026',
    giaHan1: '29/04/2026',
    giaHan2: '30/04/2026',
    giaHan3: '02/05/2026',
    ketQua: 'Đang lên danh sách nguyên vật liệu',
    linkKQ: 'https://docs.google.com/kh-t5',
    tienDo: 'Đang làm',
    vuongMac: 'Phòng kinh doanh gửi số liệu chậm',
    canLD: 'Không',
    anhHuong: 3,
  },
  'nm-5': {
    stt: 5,
    congViec: 'Cập nhật định mức',
    nguoiGiao: 'Anh Hòa',
    ngayGiao: '07/04/2026',
    ycXong: '30/04/2026',
    giaHan1: '02/05/2026',
    giaHan2: '04/05/2026',
    giaHan3: '06/05/2026',
    ketQua: 'Đang đối soát lại giá',
    linkKQ: 'https://docs.google.com/dinh-muc',
    tienDo: 'Đang làm',
    vuongMac: 'Nhà cung cấp chưa chốt giá nguyên liệu',
    canLD: 'Không',
    anhHuong: 2,
  },
  'kt-1': {
    stt: 1,
    congViec: 'Báo cáo công nợ tháng 4',
    nguoiGiao: 'Chị Lan',
    ngayGiao: '01/04/2026',
    ycXong: '05/04/2026',
    giaHan1: '06/04/2026',
    giaHan2: '07/04/2026',
    giaHan3: '08/04/2026',
    ketQua: 'Tổng công nợ 4.2 tỷ',
    linkKQ: 'https://docs.google.com/kt1',
    tienDo: 'Hoàn thành',
    vuongMac: 'Kế toán viên nghỉ ốm 1 tuần',
    canLD: 'Không',
    anhHuong: 3,
  },
  'kt-2': {
    stt: 2,
    congViec: 'Kiểm tra công nợ nhà cung cấp',
    nguoiGiao: 'Chị Lan',
    ngayGiao: '07/04/2026',
    ycXong: '18/04/2026',
    giaHan1: '20/04/2026',
    giaHan2: '22/04/2026',
    giaHan3: '25/04/2026',
    ketQua: 'Đã gửi email đối chiếu',
    linkKQ: 'https://docs.google.com/kt2',
    tienDo: 'Đang làm',
    vuongMac: 'Chờ nhà cung cấp ký xác nhận biên bản',
    canLD: 'Không',
    anhHuong: 2,
  },
  'kt-3': {
    stt: 3,
    congViec: 'Thanh toán tiền điện',
    nguoiGiao: 'Chị Lan',
    ngayGiao: '01/04/2026',
    ycXong: '10/04/2026',
    giaHan1: '12/04/2026',
    giaHan2: '14/04/2026',
    giaHan3: '16/04/2026',
    ketQua: 'Ngân hàng đang xử lý',
    linkKQ: 'https://docs.google.com/kt3',
    tienDo: 'Quá hạn',
    vuongMac: 'Giao dịch bị kẹt do lỗi hệ thống ngân hàng',
    canLD: 'Có',
    anhHuong: 3,
  },
  'oem-1': {
    stt: 1,
    congViec: 'Ký hợp đồng OEM',
    nguoiGiao: 'Chị Mai',
    ngayGiao: '07/04/2026',
    ycXong: '30/04/2026',
    giaHan1: '05/05/2026',
    giaHan2: '08/05/2026',
    giaHan3: '12/05/2026',
    ketQua: 'Đang chốt điều khoản pháp lý',
    linkKQ: 'https://docs.google.com/oem1',
    tienDo: 'Đang làm',
    vuongMac: 'Đối tác muốn tăng hạn mức tín dụng',
    canLD: 'Có',
    anhHuong: 4,
  },
  'oem-2': {
    stt: 2,
    congViec: 'Báo cáo sản lượngOEM tuần 15',
    nguoiGiao: 'Anh Hùng',
    ngayGiao: '14/04/2026',
    ycXong: '14/04/2026',
    giaHan1: '15/04/2026',
    giaHan2: '16/04/2026',
    giaHan3: '17/04/2026',
    ketQua: 'Tổng sản lượng 12400',
    linkKQ: 'https://docs.google.com/oem2',
    tienDo: 'Hoàn thành',
    vuongMac: 'Hệ thống báo cáo bị lỗi 1 ngày',
    canLD: 'Không',
    anhHuong: 2,
  },
  'tm-1': {
    stt: 1,
    congViec: 'Duyệt KPI kinh doanh Q2',
    nguoiGiao: 'Mrs Thao',
    ngayGiao: '14/04/2026',
    ycXong: '25/04/2026',
    giaHan1: '28/04/2026',
    giaHan2: '30/04/2026',
    giaHan3: '02/05/2026',
    ketQua: 'Đang soạn văn bản',
    linkKQ: 'https://docs.google.com/tm1',
    tienDo: 'Chưa bắt đầu',
    vuongMac: 'Sếp chưa phê duyệt lại chỉ tiêu',
    canLD: 'Không',
    anhHuong: 3,
  },
  'tm-2': {
    stt: 2,
    congViec: 'Báo cáo tồn kho thương mại',
    nguoiGiao: 'Anh Hùng',
    ngayGiao: '07/04/2026',
    ycXong: '15/04/2026',
    giaHan1: '18/04/2026',
    giaHan2: '20/04/2026',
    giaHan3: '22/04/2026',
    ketQua: 'Đang kiểm đếm vật tư',
    linkKQ: 'https://docs.google.com/tm2',
    tienDo: 'Đang làm',
    vuongMac: 'Kho bãi lộn xộn, kiểm đếm khó khăn',
    canLD: 'Không',
    anhHuong: 2,
  },
};

const TREE_RAW = [
  { key: 'nha-may', label: 'Công việc', tasks: ['nm-1', 'nm-2', 'nm-3', 'nm-4', 'nm-5'] },
  // { key: 'ke-toan', label: 'Kế Toán', tasks: ['kt-1', 'kt-2', 'kt-3'] },
  // { key: 'oem', label: 'OEM', tasks: ['oem-1', 'oem-2'] },
  // { key: 'thuong-mai', label: 'Thương Mại', tasks: ['tm-1', 'tm-2'] },
];

const buildTree = () =>
  TREE_RAW.map(dept => ({
    key: dept.key,
    title: dept.label,
    isLeaf: false,
    children: dept.tasks.map(tk => ({
      key: tk,
      title: ALL_TASKS[tk]?.congViec ?? tk,
      isLeaf: true,
    })),
  }));

const STATUS_CFG: Record<string, { color: string }> = {
  'Hoàn thành': { color: 'success' },
  'Đang làm': { color: 'processing' },
  'Quá hạn': { color: 'error' },
  'Chưa bắt đầu': { color: 'default' },
};

const renderStars = (level: number) => (
  <div className="flex gap-0.5">
    {[...Array(4)].map((_, i) => (
      <Star key={i} size={15} className={i < level ? 'fill-[#F38320] text-[#F38320]' : 'text-gray-300'} />
    ))}
  </div>
);

const InfoRow = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
    <div className="w-5 mt-0.5 text-[#1E386B] flex-shrink-0 text-sm">{icon}</div>
    <div className="w-44 flex-shrink-0">
      <Text type="secondary" className="text-xs uppercase tracking-wide">{label}</Text>
    </div>
    <div className="flex-1 text-sm font-medium">{children}</div>
  </div>
);

const TaskView: React.FC = () => {
  const [selected, setSelected] = useState<any>(null);
  const [selectedWeek, setSelectedWeek] = useState('week_16');

  const onSelect: TreeProps['onSelect'] = (_, info) => {
    const node = info.node as any;
    if (node.isLeaf) {
      const task = ALL_TASKS[node.key];
      if (task) setSelected({ ...task, key: node.key });
    } else {
      setSelected(null);
    }
  };

  const renderTitle = (nodeData: any) => (
    <Dropdown
      menu={{
        items: [
          { key: 'add', label: 'Thêm công việc', icon: <PlusOutlined /> },
          { key: 'edit', label: 'Đổi tên', icon: <EditOutlined /> },
          { key: 'delete', label: 'Xoá', icon: <DeleteOutlined />, danger: true },
        ],
        onClick: ({ key }) => message.info(`${key}: ${nodeData.title}`),
      }}
      trigger={['contextMenu']}
    >
      <div className="flex items-center gap-1.5 py-0.5 w-full">
        {nodeData.isLeaf
          ? <CheckSquareOutlined className="text-gray-400 text-xs flex-shrink-0" />
          : <FolderOutlined className="text-[#F38320] flex-shrink-0" />}
        <span className={nodeData.isLeaf
          ? 'text-gray-700 text-sm leading-snug'
          : 'font-bold text-[#1E386B] text-sm'}>
          {nodeData.title}
        </span>
      </div>
    </Dropdown>
  );

  const loopTree = (data: any[]): any[] =>
    data.map(item => ({
      ...item,
      title: renderTitle(item),
      children: item.children ? loopTree(item.children) : undefined,
    }));

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-100">

      {/* ── TOP BAR (TÌM KIẾM THEO TUẦN) ── */}
      <div className="bg-white px-5 py-3 border-b border-gray-200 flex items-center justify-between shadow-sm z-10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <CheckSquareOutlined className="text-[#1E386B] text-xl" />
          <h1 className="m-0 text-[#1E386B] font-bold text-lg">Quản lý Công việc</h1>
        </div>
        <div className="flex items-center gap-3">
          <Text strong className="text-gray-600 text-sm">Chọn tuần:</Text>
          <Select
            showSearch
            value={selectedWeek}
            onChange={setSelectedWeek}
            options={WEEK_OPTIONS}
            placeholder="Chọn tuần"
            size="middle"
            className="w-64"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── CỘT TRÁI ── */}
        <div className="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col shadow-md">
          <div className="px-4 py-3 bg-[#1E386B]">
            <h2 className="m-0 text-white font-bold text-sm tracking-wide flex items-center gap-2">
              <FolderOutlined /> Danh mục báo cáo
            </h2>
          </div>
          <div className="flex-1 overflow-auto p-3">
            <Tree
              blockNode
              defaultExpandAll
              onSelect={onSelect}
              treeData={loopTree(buildTree())}
              selectedKeys={selected ? [selected.key] : []}
              className="bg-transparent"
            />
          </div>
        </div>

        {/* ── CỘT PHẢI ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selected ? (
            <>
              <div className="bg-[#1E386B] px-6 py-4 flex-shrink-0 shadow">
                <p className="text-white/60 text-xs m-0 mb-0.5 tracking-wide uppercase">Chi tiết công việc</p>
                <h2 className="text-white font-bold text-lg m-0 leading-snug">{selected.congViec}</h2>
              </div>

              <div className="flex-1 overflow-auto p-5">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="bg-[#F38320] text-white text-center font-bold py-2 text-xs tracking-widest rounded-t-xl uppercase">
                    Thông tin công việc
                  </div>
                  <div className="px-5 divide-y divide-gray-100">

                    <InfoRow icon={<span className="text-xs font-bold text-gray-500">#</span>} label="STT">
                      <span className="font-bold text-[#1E386B] text-base">{selected.stt}</span>
                    </InfoRow>

                    <InfoRow icon={<CheckSquareOutlined />} label="Công việc">
                      <span className="font-semibold text-gray-800 text-base">{selected.congViec}</span>
                    </InfoRow>

                    <InfoRow icon={<UserOutlined />} label="Người được giao">
                      <Tag color="blue" className="text-sm px-2 py-0.5">{selected.nguoiGiao}</Tag>
                    </InfoRow>

                    <InfoRow icon={<CalendarOutlined />} label="Ngày giao">
                      {selected.ngayGiao}
                    </InfoRow>

                    <InfoRow icon={<ClockCircleOutlined />} label="Y/C xong">
                      <span className="text-red-600 font-semibold">{selected.ycXong}</span>
                    </InfoRow>

                    <InfoRow icon={<ClockCircleOutlined />} label="Gia hạn 1">
                      <Tag color="orange">{selected.giaHan1}</Tag>
                    </InfoRow>

                    <InfoRow icon={<ClockCircleOutlined />} label="Gia hạn 2">
                      <Tag color="volcano">{selected.giaHan2}</Tag>
                    </InfoRow>

                    <InfoRow icon={<ClockCircleOutlined />} label="Gia hạn 3">
                      <Tag color="red">{selected.giaHan3}</Tag>
                    </InfoRow>

                    <InfoRow icon={<CheckSquareOutlined />} label="Kết quả">
                      <span className="text-green-700 font-medium">{selected.ketQua}</span>
                    </InfoRow>

                    <InfoRow icon={<LinkOutlined />} label="Link KQ">
                      <a href={selected.linkKQ} target="_blank" rel="noreferrer"
                        className="text-[#1677ff] hover:underline flex items-center gap-1">
                        <LinkOutlined /> Mở link
                      </a>
                    </InfoRow>

                    <InfoRow icon={<ThunderboltOutlined />} label="Tiến độ">
                      <Tag color={(STATUS_CFG[selected.tienDo] ?? { color: 'default' }).color} className="font-semibold px-2 py-0.5">
                        {selected.tienDo}
                      </Tag>
                    </InfoRow>

                    <InfoRow icon={<WarningOutlined />} label="Vướng mắc">
                      <span className="text-red-600 font-medium">{selected.vuongMac}</span>
                    </InfoRow>

                    <InfoRow icon={<ThunderboltOutlined />} label="Cần LĐ tác động">
                      <Tag color={selected.canLD === 'Có' ? 'error' : 'default'} className="px-2">{selected.canLD}</Tag>
                    </InfoRow>

                    <InfoRow icon={<span className="text-[#F38320]">★</span>} label="Mức ảnh hưởng">
                      {renderStars(selected.anhHuong)}
                    </InfoRow>

                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
              <CheckSquareOutlined className="text-6xl text-gray-200" />
              <Text type="secondary" className="text-base">
                Chọn một công việc từ cây bên trái để xem chi tiết
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskView;
