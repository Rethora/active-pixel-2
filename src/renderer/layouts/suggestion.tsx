import { PageContainer } from '@toolpad/core';
import { Outlet } from 'react-router-dom';

export default function SuggestionLayout() {
  return (
    <PageContainer>
      <Outlet />
    </PageContainer>
  );
}
