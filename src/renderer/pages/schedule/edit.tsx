import { Suspense } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
  const navigate = useNavigate();

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Edit Schedule</Typography>
      </Box>
      <Suspense fallback={<Loading />}>
        <Await resolve={schedulePromise}>
          {(schedule) => <ScheduleForm method="PUT" schedule={schedule} />}
        </Await>
      </Suspense>
    </Box>
  );
}
