import { createRoot } from 'react-dom/client';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import App from './App';
import Layout, { rootLoader } from './layouts/dashboard';

import DashboardPage from './pages';
import SettingsPage, { settingsActions } from './pages/settings';
import ErrorPage from './pages/error';

const router = createMemoryRouter([
  {
    Component: App,
    children: [
      {
        id: 'root',
        path: '/',
        Component: Layout,
        loader: rootLoader,
        errorElement: <ErrorPage />,
        children: [
          {
            path: '/',
            Component: DashboardPage,
          },
          {
            path: '/settings',
            Component: SettingsPage,
            action: settingsActions,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <>
    <SnackbarProvider
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    />
    <RouterProvider router={router} />
  </>,
);
