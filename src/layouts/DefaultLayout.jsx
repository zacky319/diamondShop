// DefaultLayout.jsx

import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { imageExporter } from '../assets/images';
import { DashboardOutlined, DisconnectOutlined, UserOutlined,RubyOutlined } from '@ant-design/icons';
import TopNavbar from '../components/TopNavBar/TopNavBar'; // Import the TopNavbar component
import { Header } from '../components/Header/Header';

const { Footer, Sider, Content } = Layout;

function getItem(label, key, icon) {
  return {
    key,
    icon,
    label,
  };
}

export const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState(location.pathname);

  // Pages which will show sidebar menu
  const pageLocations = ['/users', '/matches']; // Add more pages here as needed

  // Sidebar menu items
  const menuItems = [
    getItem('Manage Diamonds', '/users', <RubyOutlined />),
    getItem('Manage Users', '/matches', <UserOutlined />),
    // Add more items here
  ];

  // Handle menu item click
  const handleClickMenuItem = (e) => {
    setSelectedMenu(e.key);
    navigate(e.key);
  };

  // Determine if header and footer should be displayed
  const isLoginPage = location.pathname === '/login';
  const isSignUpPage = location.pathname === '/signup';
  const showHeaderFooter = !(isLoginPage || isSignUpPage);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark" // Set theme to dark
        style={{
          display: pageLocations.includes(location.pathname) ? 'block' : 'none',

        }}
      >
        <div className="logo" style={{ height: 'fit-content' }}>
          <Link to="/dashboard">
            <img
              src={imageExporter.logo}
              alt="logo"
              style={{ width: '100%', height: '100%', objectFit: 'fill' }}
            />
          </Link>
        </div>
        <Menu
          theme="dark" // Set theme to dark
          mode="inline"
          selectedKeys={[selectedMenu]}
          onClick={handleClickMenuItem}
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        {showHeaderFooter && <TopNavbar />} {/* Conditionally render TopNavbar */}
        <Content style={{ margin: '16px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
          <div style={{ minHeight: 360 }}>{children}</div>
        </Content>
        {showHeaderFooter && (
          <Footer style={{ textAlign: 'center', backgroundColor: '#445566', color: '#fff', height:'10px'}}>
            Kidicumo Manager Page ©{new Date().getFullYear()} Created by Kidicumo Team
          </Footer>
        )}
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
