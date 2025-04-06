import { Route } from 'react-router-dom';
import {
  DashboardOutlined,
  ProductOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { NotFound } from '@/views/404';

export const routes = [
  {
    path: '/dashborad',
    name: '统计',
    icon: <DashboardOutlined />,
    element: <div>欢迎</div>,
  },
  {
    path: '/product-list',
    name: '产品',
    icon: <ProductOutlined />,
    element: <div>产品</div>,
  },
  {
    path: '/setting',
    name: '设置',
    icon: <SettingOutlined />,
    element: <div>设置</div>,
  },
  {
    path: '/*',
    name: '404',
    hideInMenu: true,
    element: <NotFound />,
  },
];

export const renderRoutes = (routes: any[]) => {
  return routes.map((route) => (
    <Route key={route.path} path={route.path} element={route.element}>
      {route.routes && renderRoutes(route.routes)}
    </Route>
  ));
};
