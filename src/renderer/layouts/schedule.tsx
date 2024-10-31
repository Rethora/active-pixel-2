import { PageContainer, useActivePage } from '@toolpad/core';
import { Suspense } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { Await, makeLoader, useRouteLoaderData } from 'react-router-typesafe';
import Loading from '../components/Loading';

export const scheduleLoader = makeLoader(async () => ({
  schedulesPromise: window.electron.store.getSchedules(),
}));

export default function ScheduleLayout() {
  const { schedulesPromise } =
    useRouteLoaderData<typeof scheduleLoader>('schedule');
  const params = useParams<{ id: string }>();
  const activePage = useActivePage();

  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={schedulesPromise}>
        {(schedules) => {
          const breadcrumbs = [...(activePage?.breadcrumbs ?? [])];
          let title = activePage?.title;

          if (params.id) {
            const path = `${activePage?.path}/edit/${params.id}`;
            const schedule = schedules.find((s) => s.id === params.id);
            if (schedule) {
              title = `Edit Schedule ${schedule.name}`;
              breadcrumbs.push({
                title,
                path,
              });
            }
          }
          return (
            <PageContainer breadcrumbs={breadcrumbs} title={title}>
              <Outlet />
            </PageContainer>
          );
        }}
      </Await>
    </Suspense>
  );
}
