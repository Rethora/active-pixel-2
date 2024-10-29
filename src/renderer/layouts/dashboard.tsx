import { Outlet } from 'react-router-dom';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { makeLoader } from 'react-router-typesafe';
import { Settings } from '../../shared/types/settings';

export const rootLoader = makeLoader(async () => ({
  settingsPromise: window.electron.store.getSettings() as Promise<Settings>,
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
