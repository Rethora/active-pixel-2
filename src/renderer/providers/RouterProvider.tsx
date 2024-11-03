import {
  createMemoryRouter,
  RouterProvider as DefaultRouterProvider,
} from 'react-router-dom';
import App from '../App';
import Layout, { rootLoader } from '../layouts/dashboard';

import DashboardPage from '../pages/dashboard';
import SettingsPage from '../pages/settings';
import SettingsEditPage from '../pages/settings/edit';
import ErrorPage from '../pages/error';
import SuggestionPage from '../pages/suggestion/get';
import NotFoundPage from '../pages/notfound';
import SchedulePage from '../pages/schedule';
import { scheduleFormActions } from '../pages/schedule/form';
import NewSchedulePage from '../pages/schedule/new';
import EditSchedulePage, { editScheduleLoader } from '../pages/schedule/edit';
import ScheduleLayout from '../layouts/schedule';
import SettingsLayout from '../layouts/settings';
import SuggestionWithFiltersPage from '../pages/suggestion/withFilters';
import SuggestionLayout from '../layouts/suggestion';
import SuggestionsPage from '../pages/suggestion';

// * make sure to update AppProvider.tsx NAVIGATION if you change the routes
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
            path: '/dashboard',
            Component: DashboardPage,
          },
          {
            path: '/settings',
            Component: SettingsLayout,
            children: [
              {
                path: '/settings',
                Component: SettingsPage,
              },
              {
                path: '/settings/edit',
                Component: SettingsEditPage,
              },
            ],
          },
          {
            path: '/suggestion',
            Component: SuggestionLayout,
            children: [
              {
                path: '/suggestion',
                Component: SuggestionsPage,
              },
              {
                path: '/suggestion/get',
                Component: SuggestionPage,
              },
              {
                path: '/suggestion/quick',
                Component: SuggestionWithFiltersPage,
              },
            ],
          },
          {
            id: 'schedule',
            path: '/schedule',
            Component: ScheduleLayout,
            children: [
              {
                path: '/schedule',
                Component: SchedulePage,
                action: scheduleFormActions,
              },
              {
                path: '/schedule/new',
                Component: NewSchedulePage,
                action: scheduleFormActions,
              },
              {
                path: '/schedule/edit/:id',
                Component: EditSchedulePage,
                loader: editScheduleLoader,
                action: scheduleFormActions,
              },
            ],
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
