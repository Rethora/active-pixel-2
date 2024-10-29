import { Suspense, useEffect, useState } from 'react';
import {
  useRouteLoaderData,
  Await,
  makeAction,
  useActionData,
} from 'react-router-typesafe';
import { Box, Button, styled, Typography } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import PercentIcon from '@mui/icons-material/Percent';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import OpenInNewOffIcon from '@mui/icons-material/OpenInNewOff';
import TabIcon from '@mui/icons-material/Tab';
import { enqueueSnackbar } from 'notistack';
import { rootLoader } from '../../layouts/dashboard';
import Loading from '../../components/Loading';
import SettingsEditPage from './edit';
import { Settings } from '../../../shared/types/settings';
import SettingsItemCard from '../../components/SettingsItemCard';

const SettingsItemCardContainer = styled(Box)({
  marginBottom: 8,
});

export const settingsActions = makeAction(async ({ request }) => {
  const formData = await request.formData();
  const formDataEntries = Object.fromEntries(formData);
  const errors: Record<string, unknown> = {};

  if (request.method === 'PUT') {
    const settings: Settings = {
      runInBackground: formDataEntries.runInBackground === 'on',
      runOnStartup: formDataEntries.runOnStartup === 'on',
      showWindowOnStartup: formDataEntries.showWindowOnStartup === 'on',
      displayUnproductiveNotifications:
        formDataEntries.displayUnproductiveNotifications === 'on',
      productivityThresholdPercentage: Number(
        formDataEntries.productivityThresholdPercentage,
      ),
      productivityCheckInterval:
        Number(formDataEntries.productivityCheckInterval) * 60000,
    };
    try {
      window.electron.store.setSettings(settings);
    } catch (error) {
      errors.error = error;
    }
  }
  return {
    success: Object.keys(errors).length === 0,
    errors,
  };
});

export default function SettingsPage() {
  const { settingsPromise } = useRouteLoaderData<typeof rootLoader>('root');
  const actionData = useActionData<typeof settingsActions>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (actionData?.success) {
      setOpen(false);
    }
    if (actionData?.errors) {
      enqueueSnackbar('Failed to update settings', {
        variant: 'error',
      });
    }
  }, [actionData]);

  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={settingsPromise}>
        {(settings) => (
          <Box>
            <Box display="flex" justifyContent="flex-end">
              <Button color="primary" onClick={() => setOpen(true)}>
                Edit
              </Button>
            </Box>
            <Box mt={4}>
              <Typography sx={{ mb: 2 }} variant="h5">
                System
              </Typography>
              <SettingsItemCardContainer>
                <SettingsItemCard
                  title="Run on Startup"
                  description="Have the app run when you start your computer"
                  value={settings.runOnStartup ? 'On' : 'Off'}
                  icon={<PlayCircleOutlineIcon />}
                />
              </SettingsItemCardContainer>
              <SettingsItemCardContainer>
                <SettingsItemCard
                  title="Run in Background"
                  description="Have the app run in the background (closing the window will not stop the app, will have to use the in app quit button or quit from the system tray)"
                  value={settings.runInBackground ? 'On' : 'Off'}
                  icon={<OpenInNewOffIcon />}
                />
              </SettingsItemCardContainer>
              <SettingsItemCardContainer>
                <SettingsItemCard
                  title="Show Window on Startup"
                  description="Have the app show the window on startup (if the app is set to run in the background)"
                  value={settings.showWindowOnStartup ? 'On' : 'Off'}
                  icon={<TabIcon />}
                />
              </SettingsItemCardContainer>
            </Box>
            <Box mt={4}>
              <Typography sx={{ mb: 2 }} variant="h5">
                Notifications
              </Typography>
              <SettingsItemCardContainer>
                <SettingsItemCard
                  title="Display Unproductive Notifications"
                  description="Use system idle time to trigger notifications (note: this may not work all the time)"
                  value={
                    settings.displayUnproductiveNotifications ? 'On' : 'Off'
                  }
                  icon={<SpeedIcon />}
                />
              </SettingsItemCardContainer>
              <SettingsItemCardContainer>
                <SettingsItemCard
                  title="Productivity Threshold"
                  description="The percentage of time that you must be productive to avoid a notification"
                  value={`${settings.productivityThresholdPercentage}%`}
                  icon={<PercentIcon />}
                />
              </SettingsItemCardContainer>
              <SettingsItemCardContainer>
                <SettingsItemCard
                  title="Productivity Check Interval"
                  description="The interval at which to check your productivity"
                  value={`${settings.productivityCheckInterval / 60000} minutes`}
                  icon={<AccessTimeIcon />}
                />
              </SettingsItemCardContainer>
            </Box>
            <SettingsEditPage
              open={open}
              onClose={() => setOpen(false)}
              settings={settings}
            />
          </Box>
        )}
      </Await>
    </Suspense>
  );
}
