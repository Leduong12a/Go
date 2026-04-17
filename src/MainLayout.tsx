import React, { useState } from 'react';
import { Layout, Menu, Input, Badge, Avatar, Dropdown, ConfigProvider, theme, Space, Breadcrumb } from 'antd';
import {
  DashboardOutlined,
  ClusterOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  SearchOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Pages (will be created next)
import Dashboard from './pages/Dashboard';
import NavigationHub from './pages/NavigationHub';
import ReportList from './pages/ReportList';
import ReportDetail from './pages/ReportDetail';
import ExecutiveView from './pages/ExecutiveView';
import CalendarView from './pages/CalendarView';
import SmartView from './pages/SmartView';
import AdminView from './pages/AdminView';
import WorkReportDetail from './pages/WorkReportDetail';
import TaskView from './pages/TaskView';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Điều hành công việc' },

    { key: '/navigation', icon: <ClusterOutlined />, label: 'Báo cáo định kỳ' },
    { key: '/tasks', icon: <CheckSquareOutlined />, label: 'Công việc' },
    // { key: '/reports', icon: <FileTextOutlined />, label: 'Danh sách báo cáo' },
    // { key: '/work-report-detail', icon: <FileTextOutlined />, label: 'Chi tiết báo cáo' },
    // { key: '/executive', icon: <ThunderboltOutlined />, label: 'Điều hành việc' },
    // { key: '/calendar', icon: <CalendarOutlined />, label: 'Lịch & Nhắc báo cáo' },
    // { key: '/smart-view', icon: <BarChartOutlined />, label: 'Tổng hợp chủ đề' },
    // { key: '/admin', icon: <SettingOutlined />, label: 'Quản trị hệ thống' },
  ];

  const userMenuItems = [
    { key: 'profile', label: 'Hồ sơ cá nhân', icon: <UserOutlined /> },
    { key: 'logout', label: 'Đăng xuất', danger: true },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" width={240} className="shadow-lg">
        <div className={`h-16 flex items-center px-6 bg-[#002140] transition-all duration-300 ${collapsed ? 'justify-center px-0' : ''}`}>
          <div className=" flex-shrink-0 h-10 w-10 flex items-center justify-center overflow-hidden mr-2 flex-shrink-0 h-10 w-10 flex items-center justify-center overflow-hidden mr-2 bg-white p-1 rounded-lg shadow-sm">
            <img
              src={"../src/img/logo.png"}
              alt="Hobiwood Logo"
              className="w-full h-auto object-contain"
            />
          </div>
          {!collapsed && <span className="font-bold text-lg text-ant-primary tracking-wider"> HoBi Wood</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="border-none mt-4"
        />

      </Sider>
      <Layout className="main">
        <Header className="bg-white p-0 flex items-center justify-between shadow-sm px-6 z-10 h-16 border-b border-ant-border">
          <Space size="large">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'text-lg cursor-pointer hover:text-ant-primary transition-colors',
              onClick: () => setCollapsed(!collapsed),
            })}
            {/* <Input
              placeholder="Tìm kiếm công việc, báo cáo..."
              prefix={<SearchOutlined className="text-gray-400" />}
              className="w-64 md:w-80 rounded-md bg-[#fafafa] border-ant-border"
              style={{ padding: '6px 12px' }}
            /> */}
          </Space>

          <Space size="large">
            {/* <div className="hidden md:flex items-center gap-2 text-[13px]">
              <span className="text-[rgba(0,0,0,0.45)]">Phòng ban:</span>
              <span className="border border-ant-border px-2 py-1 rounded bg-white cursor-pointer hover:border-ant-primary transition-colors">Nhà máy ▾</span>
            </div> */}
            <Badge count={3} dot offset={[-2, 2]} color="#fa8c16">
              <div className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition-colors">
                <BellOutlined className="text-xl text-[#1677ff]" />
              </div>
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="cursor-pointer hover:bg-gray-100 p-1 px-2 rounded-lg transition-colors">
                <Avatar icon={<UserOutlined />} className="bg-ant-primary" />
                <div className="hidden md:block">
                  <div className="text-sm font-medium leading-none text-[rgba(0,0,0,0.88)]">Anh Tuyển</div>

                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content className="p-6 bg-ant-bg overflow-auto" style={{ minHeight: 280 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/navigation" element={<NavigationHub />} />
            <Route path="/reports" element={<ReportList />} />
            <Route path="/reports/:id" element={<ReportDetail />} />
            <Route path="/executive" element={<ExecutiveView />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/smart-view" element={<SmartView />} />
            <Route path="/admin" element={<AdminView />} />
            <Route path="/tasks" element={<TaskView />} />
            <Route path="/work-report-detail" element={<WorkReportDetail />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
