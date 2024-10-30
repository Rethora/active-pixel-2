import { ReactNode, useRef } from 'react';
import {
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Box,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import { Form, redirect } from 'react-router-dom';
import { makeAction } from 'react-router-typesafe';
import { enqueueSnackbar } from 'notistack';
import { Settings } from '../../../shared/types/settings';
import { FormMethod } from '../../types/form';
import FormItem from '../../components/FormItem';

type SettingsFormProps = {
  settings: Settings;
  method: FormMethod;
};

type SettingsSectionProps = {
  children: ReactNode;
  title: string;
  description: string;
};

export const settingsActions = makeAction(async ({ request }) => {
  const formData = await request.formData();
  const formDataEntries = Object.fromEntries(formData);
  let errorMessage = 'An unknown error occurred';

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
      return redirect('/settings');
    } catch (error) {
      console.error(error);
      errorMessage = 'Failed to update settings';
    }
  }
  enqueueSnackbar(errorMessage, { variant: 'error' });
  return {
    errors: [errorMessage],
  };
});

function SettingsSection({
  children,
  title,
  description,
}: SettingsSectionProps) {
  return (
    <Card sx={{ width: '100%', maxWidth: 375, padding: 2 }}>
      <CardHeader title={title} subheader={`(${description})`} />
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function SettingsForm({
  settings = {
    runInBackground: false,
    runOnStartup: false,
    showWindowOnStartup: true,
    displayUnproductiveNotifications: false,
    productivityThresholdPercentage: 0,
    productivityCheckInterval: 600000,
  },
  method,
}: SettingsFormProps) {
  const settingsRef = useRef<Settings>(settings); // * prevent component changing default state error

  return (
    <Form method={method}>
      <Box display="flex" gap={4} flexWrap="wrap">
        <SettingsSection
          title="System"
          description="Settings that affect the overall system"
        >
          <FormItem>
            <FormControlLabel
              control={
                <Switch
                  name="runOnStartup"
                  defaultChecked={settingsRef.current.runOnStartup}
                />
              }
              label="Run app on startup"
            />
          </FormItem>
          <FormItem>
            <FormControlLabel
              control={
                <Switch
                  name="runInBackground"
                  defaultChecked={settingsRef.current.runInBackground}
                />
              }
              label="Run app in background"
            />
          </FormItem>
          <FormItem>
            <FormControlLabel
              control={
                <Switch
                  name="showWindowOnStartup"
                  defaultChecked={settingsRef.current.showWindowOnStartup}
                />
              }
              label="Show app window on startup"
            />
          </FormItem>
        </SettingsSection>
        <SettingsSection
          title="Notifications"
          description="Settings that affect notifications"
        >
          <FormItem>
            <FormControlLabel
              control={
                <Switch
                  name="displayUnproductiveNotifications"
                  defaultChecked={
                    settingsRef.current.displayUnproductiveNotifications
                  }
                />
              }
              label="Display unproductive notifications"
            />
          </FormItem>
          <FormItem maxWidth="300px">
            <TextField
              name="productivityThresholdPercentage"
              label="Productivity threshold percentage"
              defaultValue={settingsRef.current.productivityThresholdPercentage}
              type="number"
              inputProps={{
                min: 0,
                max: 100,
              }}
              fullWidth
            />
          </FormItem>
          <FormItem maxWidth="300px">
            <TextField
              name="productivityCheckInterval"
              label="Productivity check interval (minutes)"
              defaultValue={
                settingsRef.current.productivityCheckInterval / 60000
              }
              type="number"
              inputProps={{
                min: 5,
                max: 60 * 3,
              }}
              fullWidth
            />
          </FormItem>
        </SettingsSection>
      </Box>
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button type="submit">Save</Button>
      </Box>
    </Form>
  );
}
