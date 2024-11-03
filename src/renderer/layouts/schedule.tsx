import { PageContainer, useActivePage } from '@toolpad/core';
import { Outlet, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { useGetSchedulesQuery } from '../slices/schedulesSlice';

export default function ScheduleLayout() {
  const { data: schedules = [], isLoading: isSchedulesLoading } =
    useGetSchedulesQuery();
  const params = useParams<{ id: string }>();
  const activePage = useActivePage();

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

  if (isSchedulesLoading) {
    return <Loading />;
  }

  return (
    <PageContainer breadcrumbs={breadcrumbs} title={title}>
      <Outlet />
    </PageContainer>
  );
}
