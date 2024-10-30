import {
  createMemoryRouter,
  RouterProvider as DefaultRouterProvider,
} from 'react-router-dom';
import App from '../App';
import Layout, { rootLoader } from '../layouts/dashboard';

import DashboardPage from '../pages';
import SettingsPage, { settingsActions } from '../pages/settings';
import ErrorPage from '../pages/error';
import SuggestionPage from '../pages/suggestion';
import NotFoundPage from '../pages/notfound';
import SchedulePage, { scheduleLoader } from '../pages/schedule';
import { scheduleFormActions } from '../pages/schedule/form';
import NewSchedulePage from '../pages/schedule/new';

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
          {
            path: '/suggestion',
            Component: SuggestionPage,
          },
          {
            id: 'schedule',
            path: '/schedule',
            Component: SchedulePage,
            loader: scheduleLoader,
          },
          {
            path: '/schedule/new',
            Component: NewSchedulePage,
            action: scheduleFormActions,
          },
          {
            path: '*',
            Component: NotFoundPage,
          },
        ],
      },
    ],
  },
]);

export default function RouterProvider() {
  return <DefaultRouterProvider router={router} />;
}
