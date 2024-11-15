import { PageContainer } from '@toolpad/core';
import { Outlet } from 'react-router-dom';
import useBreadcrumbs from '../hooks/useBreadcrumbs';

export default function SettingsLayout() {
  const { breadcrumbs, pageTitle } = useBreadcrumbs({
    overrides: {
      '/settings/edit': {
        pageTitle: 'Edit Settings',
      },
    },
  });

  return (
    <PageContainer breadcrumbs={breadcrumbs} title={pageTitle}>
      <Outlet />
    </PageContainer>
  );
}
