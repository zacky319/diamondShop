import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { imageExporter } from '../assets/images';
import {
  RubyOutlined,
  GoldOutlined,
  ToolOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import TopNavbar from '../components/TopNavBar/TopNavBar';

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

  const pageLocations = ['/diamonds', '/materials', '/shells', '/products'];

  const menuItems = [
    getItem('Manage Diamonds', '/diamonds', <RubyOutlined />),
    getItem('Manage Materials', '/materials', <GoldOutlined />),
    getItem('Manage Shells', '/shells', <ToolOutlined />),
    getItem('Manage Products', '/products', <ShopOutlined />),
  ];

  const handleClickMenuItem = (e) => {
    setSelectedMenu(e.key);
    navigate(e.key);
  };

  const isLoginPage = location.pathname === '/login';
  const isSignUpPage = location.pathname === '/signup';
  const showHeaderFooter = !(isLoginPage || isSignUpPage);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        style={{
          display: pageLocations.includes(location.pathname) ? 'block' : 'none',
        }}
      >
        <div className="logo" style={{ height: 'fit-content' }}>
          <Link to="/users">
            <img
              src={imageExporter.logo}
              alt="logo"
              style={{ width: '100%', height: '100%', objectFit: 'fill' }}
            />
          </Link>
        </div>
        <Menu
          theme="dark"
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
        {showHeaderFooter && <TopNavbar />}
        <Content style={{ margin: '16px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
          <div style={{ minHeight: 360, height: '100%' }}>{children}</div>
        </Content>
        {showHeaderFooter && (
          <Footer
            style={{
              textAlign: 'center',
              alignContent: 'center',
              backgroundColor: '#445566',
              color: '#fff',
              height: ' 10px',
            }}
          >
            Kidicumo Manager Page ©{new Date().getFullYear()} Created by Kidicumo Team
          </Footer>
        )}
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
