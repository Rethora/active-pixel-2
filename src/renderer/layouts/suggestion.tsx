import { PageContainer, useActivePage } from '@toolpad/core';
import { Outlet, useParams } from 'react-router-dom';
import { useGetSuggestionWithAddPropsByIdQuery } from '../slices/suggestionsSlice';

export default function SuggestionLayout() {
  const activePage = useActivePage();
  const { id } = useParams();
  const { data: suggestion } = useGetSuggestionWithAddPropsByIdQuery(id ?? '');

  const breadcrumbs = [...(activePage?.breadcrumbs ?? [])];
  let title = activePage?.title ?? 'Suggestion';

  if (suggestion) {
    title = suggestion.name;
    breadcrumbs.push({
      title,
      path: `${activePage?.path}/${id}`,
    });
  }

  return (
    <PageContainer breadcrumbs={breadcrumbs} title={title}>
      <Outlet />
    </PageContainer>
  );
}
