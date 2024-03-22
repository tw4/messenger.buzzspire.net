import { FC, ReactNode, useEffect } from 'react';
import { Badge, Layout, Menu } from 'antd';
import {
  MessageOutlined,
  SettingFilled,
  LogoutOutlined,
} from '@ant-design/icons';
import { CheckAuth } from '../API/Auth.ts';

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = ({ children,}): JSX.Element => {
  const { Sider, Content } = Layout;
  const key = window.location.pathname === '/messages' ? '1' : window.location.pathname === '/settings' ? '2' : '0';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      CheckAuth(token).then((res) => {
        if (!res) {
          localStorage.removeItem('token');
          window.location.href = '/';
        }
      });
    } else {
      window.location.href = '/';
    }
  }, []);

  const logOut = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={true}
        style={{ backgroundColor: '#1A1D21' }}
      >
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[key]}
          items={[
            {
              key: '1',
              title: 'Messages',
              icon: (
                <div>
                  <Badge dot={false}>
                    <MessageOutlined />
                  </Badge>
                </div>
              ),
              label: 'Messages',
              onClick: () => (window.location.href = '/messages'),
            },
            {
              key: '2',
              title: 'Setting',
              icon: <SettingFilled />,
              label: 'Setting',
              onClick: () => (window.location.href = '/settings'),
            },
            {
              key: '3',
              title: 'Logout',
              icon: <LogoutOutlined />,
              label: 'Logout',
              danger: true,
              onClick: () => logOut(),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Content
          style={{
            minHeight: '100vh',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
