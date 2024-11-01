import {
  Box,
  Switch,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useSubmit } from 'react-router-dom';
import { Settings } from '../../../../shared/types/settings';
import DashboardItem from '../components/DashboardItem';
import useMinuteTimer from '../../../hooks/useMinuteTimer';

type Props = {
  settings: Settings;
};

export default function DoNotDisturb({ settings }: Props) {
  const submit = useSubmit();
  const theme = useTheme();
  const smallWidth = useMediaQuery(theme.breakpoints.down('sm'));
  const smallHeight = useMediaQuery('(max-height: 850px)');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(
    settings.turnOffDoNotDisturbAt
      ? dayjs(settings.turnOffDoNotDisturbAt)
      : null,
  );
  const [dateError, setDateError] = useState<string | null>(null);

  useMinuteTimer(() => {
    if (settings.doNotDisturb && settings.turnOffDoNotDisturbAt) {
      const turnOffTime = dayjs(settings.turnOffDoNotDisturbAt);
      if (dayjs().isAfter(turnOffTime)) {
        submit(
          {
            doNotDisturb: 'off',
            turnOffDoNotDisturbAt: null,
          },
          { method: 'PATCH', action: '/settings/edit' },
        );
      }
    }
  });

  const fullScreen = useMemo(
    () => smallWidth || smallHeight,
    [smallWidth, smallHeight],
  );

  const subHeaderText = useMemo(() => {
    if (settings.doNotDisturb) {
      if (settings.turnOffDoNotDisturbAt) {
        return `Do not disturb will be turned off at ${dayjs(
          settings.turnOffDoNotDisturbAt,
        ).format('h:mm A')}`;
      }
      return 'Do not disturb is on';
    }
    return 'Do not disturb is off';
  }, [settings]);

  const handleDoNotDisturbChange = (checked: boolean) => {
    submit(
      {
        doNotDisturb: checked ? 'on' : 'off',
        turnOffDoNotDisturbAt: null,
      },
      { method: 'PATCH', action: '/settings/edit' },
    );
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedDate(
      settings.turnOffDoNotDisturbAt
        ? dayjs(settings.turnOffDoNotDisturbAt)
        : null,
    );
    setDateError(null);
  };

  const handleSubmit = () => {
    if (!selectedDate || !selectedDate.isAfter(dayjs().add(1, 'minute'))) {
      setDateError('Turn off time must be at least 1 minute in the future');
      return;
    }

    submit(
      {
        doNotDisturb: 'on',
        turnOffDoNotDisturbAt: selectedDate.toISOString(),
      },
      { method: 'PATCH', action: '/settings/edit' },
    );
    setDialogOpen(false);
    setDateError(null);
  };

  return (
    <>
      <DashboardItem
        size="sm"
        cardTitle="Do Not Disturb"
        cardSubheader={subHeaderText}
        cardContent={
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Switch
                checked={settings.doNotDisturb}
                onChange={(e) => handleDoNotDisturbChange(e.target.checked)}
              />
              <Typography>{settings.doNotDisturb ? 'On' : 'Off'}</Typography>
            </Box>
            {settings.doNotDisturb && (
              <Box mt={2}>
                <Button
                  variant="outlined"
                  onClick={() => setDialogOpen(true)}
                  size="small"
                >
                  Set Turn Off Time
                </Button>
              </Box>
            )}
          </Box>
        }
      />

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullScreen={fullScreen}
      >
        <DialogTitle>
          Set The Time to Turn Off &quot;Do Not Disturb&quot;
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <DateTimePicker
              label="Turn off do not disturb at"
              value={selectedDate}
              onChange={(newDate) => {
                setSelectedDate(newDate);
                setDateError(null);
              }}
            />
            {dateError && (
              <Box mt={1}>
                <Typography color="error" variant="caption">
                  {dateError}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
