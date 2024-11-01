import { Outlet } from 'react-router-dom';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { makeLoader } from 'react-router-typesafe';

export const rootLoader = makeLoader(async () => ({
  settingsPromise: window.electron.store.getSettings(),
  schedulesPromise: window.electron.store.getSchedules(),
}));

export default function Layout() {
  return (
    <DashboardLayout defaultSidebarCollapsed>
      <Outlet />
    </DashboardLayout>
  );
}
