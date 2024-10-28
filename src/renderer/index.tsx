import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import OrdersPage from './pages/orders';
import App from './App';

const router = createMemoryRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '/',
            Component: DashboardPage,
          },
          {
            path: '/orders',
            Component: OrdersPage,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
