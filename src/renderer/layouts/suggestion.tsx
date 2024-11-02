import { PageContainer, useActivePage } from '@toolpad/core';
import { Outlet, useLocation } from 'react-router-dom';
import { makeLoader } from 'react-router-typesafe';

export const suggestionLoader = makeLoader(async () => ({
  likedSuggestions: await window.electron.store.getLikedSuggestions(),
  dislikedSuggestions: await window.electron.store.getDislikedSuggestions(),
}));

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
