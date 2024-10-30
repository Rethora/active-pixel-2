import { Suspense } from 'react';
import { makeLoader, useLoaderData, Await } from 'react-router-typesafe';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Schedule } from '../../../shared/types/schedule';
import Loading from '../../components/Loading';

export const scheduleLoader = makeLoader(async () => ({
  schedulesPromise: window.electron.store.getSchedules(),
}));

function ScheduleList({ schedules }: { schedules: Schedule[] }) {
  if (schedules.length === 0) {
    return <div>No schedules found</div>;
  }

  return <div>{schedules.map((schedule) => schedule.name).join(', ')}</div>;
}

export default function SchedulePage() {
  const { schedulesPromise } = useLoaderData<typeof scheduleLoader>();

  return (
    <Box>
      <Suspense fallback={<Loading />}>
        <Await resolve={schedulesPromise}>
          {(schedules) => (
            <Box>
              <Box display="flex" justifyContent="flex-end">
                <Link to="/schedule/new">
                  <Button>Add Schedule</Button>
                </Link>
              </Box>
              <ScheduleList schedules={schedules} />
            </Box>
          )}
        </Await>
      </Suspense>
    </Box>
  );
}
