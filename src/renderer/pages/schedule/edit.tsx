import { Suspense } from 'react';
import { Await, makeLoader, useLoaderData } from 'react-router-typesafe';
import ScheduleForm from './form';
import Loading from '../../components/Loading';

export const editScheduleLoader = makeLoader(async ({ params }) => {
  return {
    schedulePromise: window.electron.store.getSchedule(params.id ?? ''),
  };
});

export default function EditSchedulePage() {
  const { schedulePromise } = useLoaderData<typeof editScheduleLoader>();

  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={schedulePromise}>
        {(schedule) => <ScheduleForm method="PUT" schedule={schedule} />}
      </Await>
    </Suspense>
  );
}
