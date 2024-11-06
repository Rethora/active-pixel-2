import { PageContainer } from '@toolpad/core';
import { Outlet, useParams } from 'react-router-dom';
import { useGetDoNotDisturbScheduleQuery } from '../slices/doNotDisturbSchedulesSlice';
import useBreadcrumbs from '../hooks/useBreadcrumbs';

export default function DoNotDisturbLayout() {
  const { id = '' } = useParams();
  const { data: schedule } = useGetDoNotDisturbScheduleQuery(id);
  const { breadcrumbs, pageTitle } = useBreadcrumbs({
    overrides: {
      '/do-not-disturb': {
        title: 'Do Not Disturb Schedules',
        pageTitle: 'Do Not Disturb Schedules',
      },
      '/do-not-disturb/edit': {
        path: '/do-not-disturb',
      },
      '/do-not-disturb/edit/:id': {
        title: schedule?.name ?? 'Edit Do Not Disturb Schedule',
        pageTitle: schedule?.name ?? 'Edit Do Not Disturb Schedule',
      },
      '/do-not-disturb/new': {
        pageTitle: 'New Do Not Disturb Schedule',
      },
    },
  });

  return (
    <PageContainer breadcrumbs={breadcrumbs} title={pageTitle}>
      <Outlet />
    </PageContainer>
  );
}
