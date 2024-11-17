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
    hasErrors,
    errors,
  } = useForm({
    initialValues: settings,
    validationRules: {
      tooLongThresholdPercentage: (value) => {
        if (!value) return 'Invalid value';
        if (value < STORE.TOO_LONG_THRESHOLD_PERCENTAGE.MINIMUM)
          return `Value must be greater than or equal to ${STORE.TOO_LONG_THRESHOLD_PERCENTAGE.MINIMUM}`;
        if (value > STORE.TOO_LONG_THRESHOLD_PERCENTAGE.MAXIMUM)
          return `Value must be less than or equal to ${STORE.TOO_LONG_THRESHOLD_PERCENTAGE.MAXIMUM}`;
        return undefined;
      },
      tooLongCheckInterval: (value) => {
        if (!value) return 'Invalid value';
        if (value < STORE.TOO_LONG_CHECK_INTERVAL.MINIMUM)
          return `Value must be greater than or equal to ${STORE.TOO_LONG_CHECK_INTERVAL.MINIMUM}`;
        if (value > STORE.TOO_LONG_CHECK_INTERVAL.MAXIMUM)
          return `Value must be less than or equal to ${STORE.TOO_LONG_CHECK_INTERVAL.MAXIMUM}`;
        return undefined;
      },
      productivityThresholdPercentage: (value) => {
        if (!value) return 'Invalid value';
        if (value < STORE.PRODUCTIVITY_THRESHOLD_PERCENTAGE.MINIMUM)
          return `Value must be greater than or equal to ${STORE.PRODUCTIVITY_THRESHOLD_PERCENTAGE.MINIMUM}`;
        if (value > STORE.PRODUCTIVITY_THRESHOLD_PERCENTAGE.MAXIMUM)
          return `Value must be less than or equal to ${STORE.PRODUCTIVITY_THRESHOLD_PERCENTAGE.MAXIMUM}`;
        return undefined;
      },
      productivityCheckInterval: (value) => {
        if (!value) return 'Invalid value';
        if (value < STORE.PRODUCTIVITY_CHECK_INTERVAL.MINIMUM)
          return `Value must be greater than or equal to ${STORE.PRODUCTIVITY_CHECK_INTERVAL.MINIMUM}`;
        return undefined;
      },
      productivityHistoryLength: (value) => {
        if (!value) return 'Invalid value';
        if (value < STORE.PRODUCTIVITY_HISTORY_LENGTH.MINIMUM)
          return `Value must be greater than or equal to ${STORE.PRODUCTIVITY_HISTORY_LENGTH.MINIMUM}`;
        return undefined;
      },
    },
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
          <FormItem>
            <FormControlLabel
              control={
                <Switch
                  name="updateBetaReleases"
                  checked={formValues.updateBetaReleases}
                  onChange={(event) =>
                    setFormValue('updateBetaReleases', event.target.checked)
                  }
                />
              }
              label="Use beta releases"
            />
          </FormItem>
        </SettingsSection>
        <SettingsSection
          title="Notifications"
          description="Settings that affect notifications and productivity tracking"
        >
          <FormItem>
            <FormControlLabel
              control={
                <Switch
                  name="displayWorkForTooLongNotification"
                  checked={formValues.displayWorkForTooLongNotification}
                  onChange={(event) =>
                    setFormValue(
                      'displayWorkForTooLongNotification',
                      event.target.checked,
                    )
                  }
                />
              }
              label="Get notifications when working for too long"
            />
          </FormItem>
          <FormItem maxWidth="300px">
            <TextField
              name="tooLongThresholdPercentage"
              label="Work for too long threshold percentage"
              value={formValues.tooLongThresholdPercentage}
              onChange={(event) =>
                setFormValue(
                  'tooLongThresholdPercentage',
                  Number(event.target.value),
                )
              }
              error={!!errors.tooLongThresholdPercentage}
              helperText={errors.tooLongThresholdPercentage}
              type="number"
              inputProps={{
                min: STORE.TOO_LONG_THRESHOLD_PERCENTAGE.MINIMUM,
                max: STORE.TOO_LONG_THRESHOLD_PERCENTAGE.MAXIMUM,
              }}
              fullWidth
            />
          </FormItem>
          <FormItem maxWidth="300px">
            <TextField
              name="tooLongCheckInterval"
              label="Work for too long check interval (minutes)"
              value={
                formValues.tooLongCheckInterval
                  ? formValues.tooLongCheckInterval / 60000
                  : ''
              }
              onChange={(event) =>
                setFormValue(
                  'tooLongCheckInterval',
                  Number(event.target.value) * 60000,
                )
              }
              error={!!errors.tooLongCheckInterval}
              helperText={errors.tooLongCheckInterval}
              type="number"
              inputProps={{
                min: STORE.TOO_LONG_CHECK_INTERVAL.MINIMUM / 60000,
                max: STORE.TOO_LONG_CHECK_INTERVAL.MAXIMUM / 60000,
              }}
              fullWidth
            />
          </FormItem>
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
              label="Get stretch suggestion when unproductive"
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
              error={!!errors.productivityThresholdPercentage}
              helperText={errors.productivityThresholdPercentage}
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
              error={!!errors.productivityCheckInterval}
              helperText={errors.productivityCheckInterval}
              inputProps={{
                min: STORE.PRODUCTIVITY_CHECK_INTERVAL.MINIMUM / 60000,
                max: STORE.PRODUCTIVITY_CHECK_INTERVAL.MAXIMUM / 60000,
              }}
              fullWidth
            />
          </FormItem>
          <FormItem maxWidth="300px">
            <TextField
              name="productivityHistoryLength"
              label="Productivity history length"
              value={formValues.productivityHistoryLength}
              onChange={(event) =>
                setFormValue(
                  'productivityHistoryLength',
                  Number(event.target.value),
                )
              }
              type="number"
              error={!!errors.productivityHistoryLength}
              helperText={errors.productivityHistoryLength}
              inputProps={{
                min: STORE.PRODUCTIVITY_HISTORY_LENGTH.MINIMUM,
                max: STORE.PRODUCTIVITY_HISTORY_LENGTH.MAXIMUM,
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
              error={!!errors.maxUpNextItems}
              helperText={errors.maxUpNextItems}
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
              error={!!errors.upNextRange}
              helperText={errors.upNextRange}
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
        <Button
          type="submit"
          endIcon={<SaveIcon />}
          variant="contained"
          disabled={hasErrors()}
        >
          Save
        </Button>
      </Box>
    </form>
  );
}
