import { Outlet } from 'react-router-dom';
import { PageContainer } from '@toolpad/core';
import useBreadcrumbs from '../hooks/useBreadcrumbs';

export default function ProductivityLayout() {
  const { breadcrumbs, pageTitle } = useBreadcrumbs();

  return (
    <PageContainer breadcrumbs={breadcrumbs} title={pageTitle}>
      <Outlet />
    </PageContainer>
  );
}
