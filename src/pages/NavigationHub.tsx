import React, { useState } from 'react';
import { Tree, Typography, Empty, Dropdown, message, Card } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import {
  FolderOpenOutlined,
  FolderOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

// --- DỮ LIỆU GIẢ LẬP THEO ĐÚNG ĐẶC TẢ ---
const MOCK_TREE_DATA = [
  {
    key: 'nha-may',
    title: '1. Nhà máy',
    hasOverdue: true, // Cảnh báo đỏ ở Level 1
    children: [
      {
        key: 'nm-dinh-ky',
        title: 'Báo cáo định kỳ',
        children: [
          { key: 'bc-tuan-nm', title: 'Báo cáo tuần NM', isLeaf: true, hasImportant: true },
          { key: 'bc-thang-nm', title: 'Báo cáo tháng NM', isLeaf: true },
        ],
      },
      {
        key: 'nm-san-xuat',
        title: 'Báo cáo sản xuất',
        children: [
          { key: 'kq-sx-tuan', title: 'Kết quả sản xuất tuần', isLeaf: true },
          { key: 'kq-sx-thang', title: 'Kết quả sản xuất tháng', isLeaf: true },
        ],
      },
      {
        key: 'nm-loi',
        title: 'Báo cáo lỗi & chất lượng',
        hasOverdue: true,
        children: [
          { key: 'bb-loi-thang', title: 'Biên bản lỗi tháng', isLeaf: true, hasOverdue: true },
        ],
      },
      {
        key: 'nm-dinh-muc',
        title: 'Định mức & công thức',
        children: [
          { key: 'dm-san-xuat', title: 'Định mức sản xuất', isLeaf: true },
          { key: 'ct-san-xuat', title: 'Công thức sản xuất', isLeaf: true },
        ],
      },
    ],
  },
  {
    key: 'oem',
    title: '2. OEM',
    hasImportant: true,
    children: [
      { key: 'oem-cong-no', title: 'Công nợ', isLeaf: true, hasImportant: true },
      { key: 'oem-san-luong', title: 'Sản lượng', isLeaf: true },
      { key: 'oem-ton-kho', title: 'Tồn kho', isLeaf: true },
      { key: 'oem-danh-gia', title: 'Đánh giá & hạn mức', isLeaf: true },
      { key: 'oem-ke-hoach', title: 'Kế hoạch năm', isLeaf: true },
      { key: 'oem-bao-gia', title: 'Báo giá', isLeaf: true },
    ],
  },
  {
    key: 'thuong-mai',
    title: '3. Thương mại',
    children: [
      { key: 'tm-cong-no', title: 'Công nợ', isLeaf: true },
      { key: 'tm-kpi', title: 'KPI kinh doanh', isLeaf: true },
      { key: 'tm-ton-kho', title: 'Tồn kho', isLeaf: true },
      { key: 'tm-ke-hoach', title: 'Kế hoạch năm', isLeaf: true },
    ],
  },
  { key: 'du-an', title: '4. Dự án', children: [] },
  { key: 'marketing', title: '5. Marketing', children: [] },
  { key: 'ke-toan', title: '6. Kế toán', children: [] },
  {
    key: 'bao-cao-ha',
    title: '7. Báo cáo của Hà (Thư ký)',
    children: [
      { key: 'ha-cv-sep', title: 'Công việc Sếp', isLeaf: true, hasImportant: true },
      { key: 'ha-cv-theo-doi', title: 'Công việc đang theo dõi', isLeaf: true },
      { key: 'ha-cong-no-xau', title: 'Công nợ xấu', isLeaf: true, hasOverdue: true },
      { key: 'ha-nha-may', title: 'Nhà máy', isLeaf: true },
      { key: 'ha-du-an', title: 'Dự án', isLeaf: true },
      { key: 'ha-sai-gon', title: 'Sài Gòn', isLeaf: true },
    ],
  },
  { key: 'khac', title: '8. Khác (công việc phát sinh)', children: [] },
];

const NavigationHub: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [treeData, setTreeData] = useState(MOCK_TREE_DATA);

  // Xử lý khi click vào 1 dòng
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      // LƯU Ý: Lấy thuộc tính gốc (title, key) chứ không bóc từ UI
      setSelectedNode({
        key: info.node.key,
        name: info.node.title,
        isLeaf: info.node.isLeaf
      });
    } else {
      setSelectedNode(null);
    }
  };

  // Xử lý sự kiện Kéo & Thả (Drag & Drop)
  const onDrop: TreeProps['onDrop'] = (info) => {
    // Thông báo cho user biết là đã kéo thả thành công (Logic cập nhật mảng thật sẽ viết ở Backend sau)
    message.success(`Đã di chuyển thư mục: ${info.dragNode.title}`);
  };

  // Hàm render giao diện từng dòng (Thêm Icon Đỏ/Sao)
  const renderTitle = (nodeData: any) => {
    return (
      <Dropdown
        menu={{
          items: [
            { key: 'add', label: 'Thêm thư mục con', icon: <PlusOutlined /> },
            { key: 'edit', label: 'Đổi tên', icon: <EditOutlined /> },
            { key: 'delete', label: 'Xoá', icon: <DeleteOutlined />, danger: true },
          ],
          onClick: ({ key }) => message.info(`Đã chọn ${key} cho: ${nodeData.title}`),
        }}
        trigger={['contextMenu']}
      >
        <div className={`flex items-center justify-between w-full pr-2 py-1 rounded hover:bg-blue-50 transition-colors`}>
          <span className="flex items-center text-gray-700">
            {nodeData.isLeaf ? (
              <FileTextOutlined className="text-gray-400 mr-2" />
            ) : (
              <FolderOutlined className="text-blue-500 mr-2" />
            )}
            {nodeData.title}
          </span>

          {/* LOGIC ICON TRẠNG THÁI THEO ĐẶC TẢ */}
          <div className="flex space-x-1 ml-2">
            {nodeData.hasImportant && <span title="Có việc quan trọng">⭐</span>}
            {nodeData.hasOverdue && <span title="Có việc quá hạn">🔴</span>}
          </div>
        </div>
      </Dropdown>
    );
  };

  // Hàm đệ quy (Recursive) để lặp qua N tầng thư mục
  const loopTreeData = (data: any[]): any[] =>
    data.map((item) => {
      const title = renderTitle(item);
      if (item.children) {
        return { ...item, title, children: loopTreeData(item.children) };
      }
      return { ...item, title };
    });

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6 p-6 bg-gray-50">
      {/* CỘT TRÁI: CÂY THƯ MỤC */}
      <Card className="w-80 shadow-sm border border-gray-200 overflow-auto h-full" bodyStyle={{ padding: '16px' }}>
        <Title level={5} className="mb-4 text-blue-900 border-b pb-2">Cấu trúc báo cáo</Title>
        <Tree
          className="bg-transparent"
          draggable
          blockNode
          defaultExpandAll
          onSelect={onSelect}
          onDrop={onDrop}
          treeData={loopTreeData(treeData)}
        />
      </Card>

      {/* CỘT PHẢI: NỘI DUNG CHI TIẾT */}
      <Card className="flex-1 shadow-sm border border-gray-200 h-full overflow-auto">
        {selectedNode ? (
          <div className="w-full h-full p-2">
            <div className="border-b pb-4 mb-6">
              <Text type="secondary">Đang xem: </Text>
              {/* Hiển thị tên an toàn, không sợ crash */}
              <Title level={3} className="m-0 text-orange-600">{selectedNode.name}</Title>
            </div>

            {selectedNode.isLeaf ? (
              <div className="bg-blue-50 p-6 rounded-lg text-center border border-blue-100">
                <FileTextOutlined className="text-4xl text-blue-300 mb-2" />
                <Title level={5}>Đây là màn hình Chi tiết báo cáo (Level 3)</Title>
                <Text type="secondary">Lát nữa mình sẽ code cái Bảng danh sách công việc vào đây.</Text>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} hoverable className="border border-gray-200 shadow-sm hover:border-blue-400 transition-all">
                    <div className="flex flex-col items-center justify-center py-6">
                      <FolderOpenOutlined className="text-4xl text-blue-400 mb-2" />
                      <Text strong>Thư mục con {i}</Text>
                      <Text type="secondary" className="text-xs mt-1">3 file | Cập nhật: Hôm nay</Text>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Empty
            className="mt-32"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="flex flex-col items-center">
                <Text type="secondary" className="text-base">Chọn một thư mục từ cây bên trái để xem nội dung</Text>
              </div>
            }
          />
        )}
      </Card>
    </div>
  );
};

export default NavigationHub;