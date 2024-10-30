import { Suspense } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { Await, useRouteLoaderData } from 'react-router-typesafe';
import SettingsForm from './form';
import { rootLoader } from '../../layouts/dashboard';
import Loading from '../../components/Loading';

export default function SettingsEditPage() {
  const { settingsPromise } = useRouteLoaderData<typeof rootLoader>('root');
  const navigate = useNavigate();

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <IconButton onClick={() => navigate('/settings')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Edit Settings</Typography>
      </Box>
      <Suspense fallback={<Loading />}>
        <Await resolve={settingsPromise}>
          {(settings) => <SettingsForm settings={settings} method="PUT" />}
        </Await>
      </Suspense>
    </Box>
  );
}
