import {
  createMemoryRouter,
  RouterProvider as DefaultRouterProvider,
} from 'react-router-dom';
import App from '../App';
import Layout from '../layouts/dashboard';

import DashboardPage from '../pages/dashboard';
import SettingsPage from '../pages/settings';
import SettingsEditPage from '../pages/settings/edit';
import ErrorPage from '../pages/error';
import SuggestionPage from '../pages/suggestion/get';
import NotFoundPage from '../pages/notfound';
import SchedulePage from '../pages/schedule';
import NewSchedulePage from '../pages/schedule/new';
import EditSchedulePage from '../pages/schedule/edit';
import ScheduleLayout from '../layouts/schedule';
import SettingsLayout from '../layouts/settings';
import SuggestionWithFiltersPage from '../pages/suggestion/withFilters';
import SuggestionLayout from '../layouts/suggestion';
import SuggestionsPage from '../pages/suggestion';
import DailyProgressPage from '../pages/progress/daily';
import ProgressLayout from '../layouts/progress';

// * make sure to update AppProvider.tsx NAVIGATION if you change the routes
const router = createMemoryRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
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
            path: '/suggestions',
            Component: SuggestionLayout,
            children: [
              {
                path: '/suggestions',
                Component: SuggestionsPage,
              },
              {
                path: '/suggestions/quick',
                Component: SuggestionWithFiltersPage,
              },
              {
                path: '/suggestions/:id',
                Component: SuggestionPage,
              },
            ],
          },
          {
            path: '/schedules',
            Component: ScheduleLayout,
            children: [
              {
                path: '/schedules',
                Component: SchedulePage,
              },
              {
                path: '/schedules/new',
                Component: NewSchedulePage,
              },
              {
                path: '/schedules/edit/:id',
                Component: EditSchedulePage,
              },
            ],
          },
          {
            path: '/progress',
            Component: ProgressLayout,
            children: [
              {
                path: '/progress',
                Component: DailyProgressPage,
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
