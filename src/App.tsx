import { ProLayout } from '@ant-design/pro-components';
import { Routes, Link, useLocation } from 'react-router-dom';
import { renderRoutes, routes } from './routes/router';
import './App.css';

export const App = () => {
  const { pathname } = useLocation();

  return (
    <ProLayout
      title="启优后台管理"
      logo="https://procomponents.ant.design/favicon.ico"
      route={{
        path: '/dashborard',
        routes,
      }}
      contentStyle={{ padding: 0 }}
      location={{ pathname }}
      menuItemRender={(item, dom) => {
        const targetPath = item.path || '';
        return <Link to={targetPath}>{dom}</Link>;
      }}
    >
      <Routes>{renderRoutes(routes) as React.ReactNode}</Routes>
    </ProLayout>
  );
};
