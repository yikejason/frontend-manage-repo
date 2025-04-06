import { Route } from 'react-router-dom';
import { lazy } from 'react';
import {
  DashboardOutlined,
  ProductOutlined,
  SettingOutlined,
} from '@ant-design/icons';

// 404 page
const NotFoundPage = lazy(() => import('../views/404'));

// dashboard page
const DashboardPage = lazy(() => import('../views/dashboard'));

// product page
const ProductPage = lazy(() => import('../views/product'));

// setting page
const SettingPage = lazy(() => import('../views/setting'));

export const routes = [
  {
    path: '/dashborad',
    name: '统计',
    icon: <DashboardOutlined />,
    element: <DashboardPage />,
  },
  {
    path: '/product-list',
    name: '产品',
    icon: <ProductOutlined />,
    element: <ProductPage />,
  },
  {
    path: '/setting',
    name: '设置',
    icon: <SettingOutlined />,
    element: <SettingPage />,
  },
  {
    path: '/*',
    name: '404',
    hideInMenu: true,
    element: <NotFoundPage />,
  },
];

export const renderRoutes = (routes: any[]) => {
  return routes.map((route) => (
    <Route key={route.path} path={route.path} element={route.element}>
      {route.routes && renderRoutes(route.routes)}
    </Route>
  ));
};
