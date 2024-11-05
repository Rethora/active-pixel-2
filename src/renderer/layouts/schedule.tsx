import { PageContainer } from '@toolpad/core';
import { Outlet, useParams } from 'react-router-dom';
import useBreadcrumbs from '../hooks/useBreadcrumbs';
import { useGetScheduleQuery } from '../slices/schedulesSlice';

export default function ScheduleLayout() {
  const { id } = useParams();
  const { data: schedule } = useGetScheduleQuery(id ?? '');
  const { breadcrumbs, pageTitle } = useBreadcrumbs({
    overrides: {
      '/schedules/edit': {
        path: '/schedules',
      },
      '/schedules/edit/:id': {
        title: schedule?.name ?? 'Edit Schedule',
        pageTitle: schedule?.name ?? 'Edit Schedule',
      },
      '/schedules/new': {
        pageTitle: 'New Schedule',
      },
    },
  });

  return (
    <PageContainer breadcrumbs={breadcrumbs} title={pageTitle}>
      <Outlet />
    </PageContainer>
  );
}
