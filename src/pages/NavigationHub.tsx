import React, { useState } from 'react';
import { Tree, Typography, Tag, Descriptions, Empty, Dropdown, message } from 'antd';
import type { TreeProps } from 'antd';
import {
  FolderOutlined,
  FileTextOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  BranchesOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

// ─── DỮ LIỆU BÁO CÁO ─────────────────────────────────────────────────────────
const ALL_REPORTS: Record<string, any> = {
  'nm-r1': { stt: 1, name: 'Báo cáo tuần của Mr Hùng/phụ trách NM', noidung: 'Tình hình sản xuất tuần tại NM', ngay: 'Thứ 2', ky: 'Tuần', nguoiGui: 'Mr Hùng – Nhà máy', nguoiNhan: 'Mr Tuyển + BLĐ', luong: 'Base', link: 'https://docs.google.com/spreadsheets/d/A71' },
  'nm-r2': { stt: 2, name: 'Báo cáo tháng Mr Hùng/phụ trách NM', noidung: 'Tổng hợp tháng tại nhà máy', ngay: 'Ngày 5', ky: 'Tháng', nguoiGui: 'Mr Hùng – Nhà máy', nguoiNhan: 'Mr Tuyển + BLĐ', luong: 'Base', link: 'https://docs.google.com/spreadsheets/d/B2' },
  'nm-r3': { stt: 3, name: 'Tổng hợp biên bản xử lý lỗi trong sản xuất cả tháng trước', noidung: 'Xử lý các lỗi trong ca tháng trước', ngay: 'Ngày 5', ky: 'Tháng', nguoiGui: 'Mr Hùng – Nhà máy', nguoiNhan: 'Mr Tuyển + BLĐ', luong: 'Base', link: 'https://docs.google.com/spreadsheets/d/C1' },
  'nm-r4': { stt: 4, name: 'Cập nhật định mức sản xuất', noidung: 'Các thay đổi định mức trong sản xuất', ngay: 'Ngày 30 tháng đầu tiên', ky: 'Quý', nguoiGui: 'Mr Hòa – Kế hoạch sx NM', nguoiNhan: 'Mr Tuyển + BLĐ + Kế toán', luong: 'Base', link: 'https://docs.google.com/spreadsheets/d/D8' },
  'nm-r5': { stt: 5, name: 'Cập nhật bổ công thức trong sản xuất', noidung: 'Khi có thay đổi công thức đóng hàng', ngay: 'Ngày 5 / Khi thay đổi', ky: 'Tháng', nguoiGui: 'Mr Hòa – Kế hoạch sx NM', nguoiNhan: 'BLĐ + Kế toán', luong: 'Base', link: 'https://docs.google.com/spreadsheets/d/E3' },
  'nm-r6': { stt: 6, name: 'Báo cáo kết quả SX – biến động nhân sự – sản lượng bán NM', noidung: 'Sản lượng bán nhà máy theo tuần và tháng', ngay: '• Thứ 3\n• Ngày 8', ky: 'Tuần/Tháng', nguoiGui: 'Mr Tuyển', nguoiNhan: 'Mr Thụ, Mrs Thao', luong: 'Base', link: 'https://docs.google.com/spreadsheets/d/F9' },

  'oem-r1': { stt: 1, name: 'Báo cáo công nợ OEM', noidung: 'Theo dõi công nợ khách hàng OEM', ngay: 'Ngày 5', ky: 'Tháng', nguoiGui: 'Chị Lan – Kế toán', nguoiNhan: 'Mr Tuyển + BLĐ', luong: 'Base', link: 'https://docs.google.com' },
  'oem-r2': { stt: 2, name: 'Báo cáo sản lượng OEM', noidung: 'Tổng hợp sản lượng đơn OEM', ngay: 'Thứ 2', ky: 'Tuần', nguoiGui: 'Mr Hùng – OEM', nguoiNhan: 'Mr Tuyển', luong: 'Base', link: 'https://docs.google.com' },
  'oem-r3': { stt: 3, name: 'Tồn kho OEM', noidung: 'Báo cáo tồn kho nguyên liệu OEM', ngay: 'Ngày 5', ky: 'Tháng', nguoiGui: 'Anh Hùng – Kho', nguoiNhan: 'Mr Tuyển + Kế toán', luong: 'Base', link: 'https://docs.google.com' },
  'oem-r4': { stt: 4, name: 'Đánh giá & hạn mức OEM', noidung: 'Đánh giá khách hàng và hạn mức tín dụng', ngay: 'Ngày 10', ky: 'Quý', nguoiGui: 'Chị Mai – Kinh doanh', nguoiNhan: 'Mr Tuyển + Kế toán', luong: 'Base', link: 'https://docs.google.com' },

  'tm-r1': { stt: 1, name: 'KPI kinh doanh', noidung: 'Theo dõi KPI đội kinh doanh thương mại', ngay: 'Ngày 5', ky: 'Tháng', nguoiGui: 'Mrs Thao – KD', nguoiNhan: 'Mr Tuyển + BLĐ', luong: 'Base', link: 'https://docs.google.com' },
  'tm-r2': { stt: 2, name: 'Công nợ thương mại', noidung: 'Tổng hợp công nợ khách thương mại', ngay: 'Ngày 5', ky: 'Tháng', nguoiGui: 'Chị Lan – Kế toán', nguoiNhan: 'Mr Tuyển', luong: 'Base', link: 'https://docs.google.com' },
  'tm-r3': { stt: 3, name: 'Tồn kho thương mại', noidung: 'Báo cáo tồn kho sản phẩm thương mại', ngay: 'Ngày 5', ky: 'Tháng', nguoiGui: 'Anh Hùng – Kho', nguoiNhan: 'Mr Tuyển', luong: 'Base', link: 'https://docs.google.com' },
};

// ─── CÂY THƯ MỤC ──────────────────────────────────────────────────────────────
const TREE_RAW = [
  {
    key: 'nha-may', label: 'Nhà Máy',
    children: ['nm-r1', 'nm-r2', 'nm-r3', 'nm-r4', 'nm-r5', 'nm-r6'],
  },
  {
    key: 'oem', label: 'OEM',
    children: ['oem-r1', 'oem-r2', 'oem-r3', 'oem-r4'],
  },
  {
    key: 'thuong-mai', label: 'Thương Mại',
    children: ['tm-r1', 'tm-r2', 'tm-r3'],
  },
  { key: 'du-an', label: 'Dự Án', children: [] },
  { key: 'marketing', label: 'Marketing', children: [] },
  { key: 'ke-toan', label: 'Kế Toán', children: [] },
  { key: 'khac', label: 'Khác (phát sinh)', children: [] },
];

const buildTreeData = () =>
  TREE_RAW.map((dept, idx) => {
    const periods: Record<string, string[]> = {
      'Báo cáo Tuần': [],
      'Báo cáo Tháng': [],
      'Báo cáo Quý': [],
    };

    dept.children.forEach(rKey => {
      const report = ALL_REPORTS[rKey];
      if (!report) return;
      
      const ky = (report.ky || '').toLowerCase();
      if (ky.includes('tuần')) periods['Báo cáo Tuần'].push(rKey);
      else if (ky.includes('tháng')) periods['Báo cáo Tháng'].push(rKey);
      else if (ky.includes('quý')) periods['Báo cáo Quý'].push(rKey);
      else periods['Báo cáo Tháng'].push(rKey); // fallback
    });

    const childrenNodes: any[] = [];
    Object.entries(periods).forEach(([pLabel, keys]) => {
      if (keys.length > 0) {
        childrenNodes.push({
          key: `${dept.key}-${pLabel}`,
          title: pLabel,
          isLeaf: false,
          isPeriod: true,
          children: keys.map(k => ({
            key: k,
            title: ALL_REPORTS[k]?.name ?? k,
            isLeaf: true,
          })),
        });
      }
    });

    return {
      key: dept.key,
      title: dept.label,
      isLeaf: false,
      dept: true,
      index: idx + 1,
      children: childrenNodes,
    };
  });

// ─── COMPONENT ────────────────────────────────────────────────────────────────
const NavigationHub: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  const onSelect: TreeProps['onSelect'] = (_, info) => {
    const node = info.node as any;
    if (node.isLeaf) {
      const report = ALL_REPORTS[node.key];
      if (report) setSelectedReport({ ...report, key: node.key });
    } else {
      setSelectedReport(null);
      setSelectedDept(node.key);
    }
  };

  const renderTitle = (nodeData: any) => (
    <Dropdown
      menu={{
        items: [
          { key: 'add', label: 'Thêm', icon: <PlusOutlined /> },
          { key: 'edit', label: 'Đổi tên', icon: <EditOutlined /> },
          { key: 'delete', label: 'Xoá', icon: <DeleteOutlined />, danger: true },
        ],
        onClick: ({ key }) => message.info(`${key}: ${nodeData.title}`),
      }}
      trigger={['contextMenu']}
    >
      <div className="flex items-center gap-1.5 py-0.5 w-full">
        {nodeData.isLeaf
          ? <FileTextOutlined className="text-gray-400 text-xs flex-shrink-0" />
          : nodeData.isPeriod 
             ? <FolderOutlined className="text-[#1E386B] flex-shrink-0" /> 
             : <FolderOutlined className="text-[#F38320] flex-shrink-0" />}
        <span className={nodeData.isLeaf
          ? 'text-gray-700 text-sm leading-snug'
          : 'font-bold text-[#1E386B] text-sm'}>
          {nodeData.isLeaf ? nodeData.title : `${nodeData.title}`}
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
    <div className="flex h-[calc(100vh-80px)] bg-gray-100">

      {/* ── CỘT TRÁI: CÂY ── */}
      <div className="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col shadow-md">
        <div className="px-4 py-3 bg-[#1E386B]">
          <h2 className="m-0 text-white font-bold text-sm tracking-wide">📁 Cấu trúc báo cáo</h2>
        </div>
        <div className="flex-1 overflow-auto p-3">
          <Tree
            blockNode
            defaultExpandAll
            onSelect={onSelect}
            treeData={loopTree(buildTreeData())}
            selectedKeys={selectedReport ? [selectedReport.key] : []}
            className="bg-transparent"
          />
        </div>
      </div>

      {/* ── CỘT PHẢI: CHI TIẾT ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedReport ? (
          <>
            {/* Header */}
            <div className="bg-[#1E386B] px-6 py-4 flex-shrink-0">
              <p className="text-white/60 text-xs m-0 mb-0.5">Chi tiết báo cáo</p>
              <h2 className="text-white font-bold text-lg m-0 leading-snug">{selectedReport.name}</h2>
            </div>

            {/* Nội dung chi tiết */}
            <div className="flex-1 overflow-auto p-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                {/* Dòng group header giống Excel */}
                <div className="bg-[#F38320] text-white text-center font-bold py-2 text-sm tracking-widest">
                  NHÀ MÁY
                </div>

                {/* Bảng thông tin 1 báo cáo */}
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#1E386B] text-white">
                      {['STT', 'Tên báo cáo', 'Nội dung', 'Ngày báo cáo', 'Kỳ báo cáo', 'Người gửi', 'Người nhận', 'Luồng', 'Link'].map(h => (
                        <th key={h} className="px-3 py-2 text-left font-semibold text-xs border border-[#2a4a7f] whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-3 py-3 border border-gray-200 text-center font-bold text-[#1E386B]">{selectedReport.stt}</td>
                      <td className="px-3 py-3 border border-gray-200 font-semibold text-[#1E386B] max-w-[220px]">{selectedReport.name}</td>
                      <td className="px-3 py-3 border border-gray-200 text-gray-600 max-w-[180px]">{selectedReport.noidung}</td>
                      <td className="px-3 py-3 border border-gray-200 whitespace-pre-line text-center">
                        <Tag color="blue" className="text-xs">{selectedReport.ngay}</Tag>
                      </td>
                      <td className="px-3 py-3 border border-gray-200 text-center">
                        <Tag color="geekblue">{selectedReport.ky}</Tag>
                      </td>
                      <td className="px-3 py-3 border border-gray-200">{selectedReport.nguoiGui}</td>
                      <td className="px-3 py-3 border border-gray-200">{selectedReport.nguoiNhan}</td>
                      <td className="px-3 py-3 border border-gray-200 text-center">
                        <Tag color="orange">{selectedReport.luong}</Tag>
                      </td>
                      <td className="px-3 py-3 border border-gray-200">
                        <a href={selectedReport.link} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 text-[#1677ff] hover:underline text-xs whitespace-nowrap">
                          <LinkOutlined /> Mở link
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>


              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <FileTextOutlined className="text-6xl text-gray-200" />
            <Text type="secondary" className="text-base">
              Chọn một tên báo cáo từ cây bên trái để xem chi tiết
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationHub;