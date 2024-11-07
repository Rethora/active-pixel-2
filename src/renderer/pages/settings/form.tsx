import { FormEvent, ReactNode, useCallback, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import SaveIcon from '@mui/icons-material/Save';
import { PartialSettings } from '../../../shared/types/settings';
import FormItem from '../../components/FormItem';
import { useUpdateSettingsMutation } from '../../slices/settingsSlice';
import Loading from '../../components/Loading';
import useForm from '../../hooks/useForm';
import STORE from '../../../shared/constants/store';

type SettingsFormProps = {
  settings: PartialSettings;
};

type SettingsSectionProps = {
  children: ReactNode;
  title: string;
  description: string;
};

function SettingsSection({
  children,
  title,
  description,
}: SettingsSectionProps) {
  return (
    <Card sx={{ width: '100%', maxWidth: 360, padding: 2 }}>
      <CardHeader title={title} subheader={`(${description})`} />
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const navigate = useNavigate();
  const [updateSettings, { isLoading, isSuccess }] =
    useUpdateSettingsMutation();
  const {
    values: formValues,
    setValue: setFormValue,
    getChangedValues,
  } = useForm({
    initialValues: settings,
  });

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Settings updated', { variant: 'success' });
      navigate('/settings');
    }
  }, [isSuccess, navigate]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      updateSettings(getChangedValues());
    },
    [updateSettings, getChangedValues],
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" gap={4} flexWrap="wrap" justifyContent="space-evenly">
        <SettingsSection
          title="System"
          description="Settings that affect the overall system"
        >
          <FormItem>
            <FormControlLabel
              control={
                <Switch
                  name="runOnStartup"
                  checked={formValues.runOnStartup}
                  onChange={(event) =>
                    setFormValue('runOnStartup', event.target.checked)
                  }
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
                  checked={formValues.runInBackground}
                  onChange={(event) =>
                    setFormValue('runInBackground', event.target.checked)
                  }
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
                  checked={formValues.showWindowOnStartup}
                  onChange={(event) =>
                    setFormValue('showWindowOnStartup', event.target.checked)
                  }
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
                  checked={formValues.displayUnproductiveNotifications}
                  onChange={(event) =>
                    setFormValue(
                      'displayUnproductiveNotifications',
                      event.target.checked,
                    )
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
              value={formValues.productivityThresholdPercentage}
              onChange={(event) =>
                setFormValue(
                  'productivityThresholdPercentage',
                  Number(event.target.value),
                )
              }
              type="number"
              inputProps={{
                min: STORE.PRODUCTIVITY_THRESHOLD_PERCENTAGE.MINIMUM,
                max: STORE.PRODUCTIVITY_THRESHOLD_PERCENTAGE.MAXIMUM,
              }}
              fullWidth
            />
          </FormItem>
          <FormItem maxWidth="300px">
            <TextField
              name="productivityCheckInterval"
              label="Productivity check interval (minutes)"
              value={
                formValues.productivityCheckInterval
                  ? formValues.productivityCheckInterval / 60000
                  : ''
              }
              onChange={(event) =>
                setFormValue(
                  'productivityCheckInterval',
                  Number(event.target.value) * 60000,
                )
              }
              type="number"
              inputProps={{
                min: STORE.PRODUCTIVITY_CHECK_INTERVAL.MINIMUM / 60000,
                max: STORE.PRODUCTIVITY_CHECK_INTERVAL.MAXIMUM / 60000,
              }}
              fullWidth
            />
          </FormItem>
        </SettingsSection>
        <SettingsSection
          title="Dashboard"
          description="Settings that affect the dashboard"
        >
          <FormItem>
            <TextField
              name="maxUpNextItems"
              label="Max upcoming schedules"
              value={formValues.maxUpNextItems}
              onChange={(event) =>
                setFormValue('maxUpNextItems', Number(event.target.value))
              }
              type="number"
              inputProps={{
                min: STORE.MAX_UP_NEXT_ITEMS.MINIMUM,
                max: STORE.MAX_UP_NEXT_ITEMS.MAXIMUM,
              }}
              fullWidth
            />
          </FormItem>
          <FormItem>
            <TextField
              name="upNextRange"
              label="Upcoming schedules range (hours)"
              value={formValues.upNextRange}
              onChange={(event) =>
                setFormValue('upNextRange', Number(event.target.value))
              }
              type="number"
              inputProps={{
                min: STORE.UP_NEXT_RANGE.MINIMUM,
                max: STORE.UP_NEXT_RANGE.MAXIMUM,
              }}
              fullWidth
            />
          </FormItem>
        </SettingsSection>
      </Box>
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button type="submit" endIcon={<SaveIcon />} variant="contained">
          Save
        </Button>
      </Box>
    </form>
  );
}
