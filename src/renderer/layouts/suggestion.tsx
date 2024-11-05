import { PageContainer } from '@toolpad/core';
import { Outlet, useParams } from 'react-router-dom';
import { useGetSuggestionWithAddPropsByIdQuery } from '../slices/suggestionsSlice';
import useBreadcrumbs from '../hooks/useBreadcrumbs';

export default function SuggestionLayout() {
  const { id } = useParams();
  const { data: suggestion } = useGetSuggestionWithAddPropsByIdQuery(id ?? '');
  const { breadcrumbs, pageTitle } = useBreadcrumbs({
    overrides: {
      '/suggestions/:id': {
        title: suggestion?.name ?? 'Suggestion',
        pageTitle: suggestion?.name ?? 'Suggestion',
      },
      '/suggestions/quick': {
        pageTitle: 'Quick Suggestion',
      },
    },
  });

  return (
    <PageContainer breadcrumbs={breadcrumbs} title={pageTitle}>
      <Outlet />
    </PageContainer>
  );
}
