import { PageContainer, useActivePage } from '@toolpad/core';
import { Outlet, useLocation } from 'react-router-dom';

export default function SuggestionLayout() {
  const activePage = useActivePage();
  const { state } = useLocation();

  const breadcrumbs = [...(activePage?.breadcrumbs ?? [])];
  let title = activePage?.title ?? 'Suggestion';

  if (state?.suggestion) {
    title = state.suggestion.name;
    breadcrumbs.push({
      title,
      path: `${activePage?.path}/get/`,
    });
  }

  return (
    <PageContainer breadcrumbs={breadcrumbs} title={title}>
      <Outlet />
    </PageContainer>
  );
}
