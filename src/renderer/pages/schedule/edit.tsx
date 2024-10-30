import { Suspense } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Await, makeLoader, useLoaderData } from 'react-router-typesafe';
import ScheduleForm from './form';
import Loading from '../../components/Loading';

export const editScheduleLoader = makeLoader(async ({ params }) => {
  console.log('params', params.id);
  return {
    schedulePromise: window.electron.store.getSchedule(params.id ?? ''),
  };
});

export default function EditSchedule() {
  const { schedulePromise } = useLoaderData<typeof editScheduleLoader>();
  const navigate = useNavigate();

  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={schedulePromise}>
        {(schedule) => {
          console.log('schedule', schedule);

          return (
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton onClick={() => navigate(-1)}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">Edit Schedule</Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <ScheduleForm method="PUT" schedule={schedule} />
              </Box>
            </Box>
          );
        }}
      </Await>
    </Suspense>
  );
}
