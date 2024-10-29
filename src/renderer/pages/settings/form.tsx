import { useRef } from 'react';
import {
  Button,
  FormControl,
  FormControlLabel,
  styled,
  Switch,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { Form } from 'react-router-dom';
import { Settings } from '../../../shared/types/settings';
import { FormMethod } from '../../types/form';

type SettingsFormProps = {
  settings: Settings;
  method: FormMethod;
};

const FormItem = styled(FormControl)({
  marginBottom: 16,
  width: '100%',
});

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
      <Box mb={2}>
        <Typography variant="h6">System</Typography>
        <Typography variant="subtitle1">
          Settings that affect the overall system
        </Typography>
      </Box>
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
      <Box mb={2}>
        <Typography variant="h6">Notifications</Typography>
        <Typography variant="subtitle1">
          Settings that affect notifications
        </Typography>
      </Box>
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
      <FormItem>
        <TextField
          name="productivityThresholdPercentage"
          label="Productivity threshold percentage"
          defaultValue={settingsRef.current.productivityThresholdPercentage}
          type="number"
          inputProps={{
            min: 0,
            max: 100,
          }}
        />
      </FormItem>
      <FormItem>
        <TextField
          name="productivityCheckInterval"
          label="Productivity check interval (minutes)"
          defaultValue={settingsRef.current.productivityCheckInterval / 60000}
          type="number"
          inputProps={{
            min: 5,
            max: 60 * 3,
          }}
        />
      </FormItem>
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button type="submit">Save</Button>
      </Box>
    </Form>
  );
}
