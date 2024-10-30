import { Outlet } from 'react-router-dom';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { makeLoader } from 'react-router-typesafe';

export const rootLoader = makeLoader(async () => ({
  settingsPromise: window.electron.store.getSettings(),
}));

export default function Layout() {
  return (
    <DashboardLayout defaultSidebarCollapsed>
      <PageContainer breadcrumbs={[]}>
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  );
}
