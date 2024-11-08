import { PageContainer } from '@toolpad/core';
import { Outlet } from 'react-router-dom';

export default function ProgressLayout() {
  return (
    <PageContainer>
      <Outlet />
    </PageContainer>
  );
}
