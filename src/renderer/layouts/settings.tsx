import { PageContainer } from '@toolpad/core';
import { Outlet } from 'react-router-dom';

export default function SettingsLayout() {
  return (
    <PageContainer>
      <Outlet />
    </PageContainer>
  );
}
