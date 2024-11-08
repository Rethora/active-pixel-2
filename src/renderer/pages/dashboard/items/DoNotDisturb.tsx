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
import { useNavigate } from 'react-router-dom';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import DoNotDisturbOffIcon from '@mui/icons-material/DoNotDisturbOff';
import TimerIcon from '@mui/icons-material/Timer';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { Settings } from '../../../../shared/types/settings';
import DashboardItem from '../components/DashboardItem';
import useMinuteTimer from '../../../hooks/useMinuteTimer';
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from '../../../slices/settingsSlice';

export default function DoNotDisturb() {
  const { data: settings = {} as Settings, isLoading } = useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();
  const navigate = useNavigate();
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

  // TODO: remove this and use interval from settings
  useMinuteTimer(() => {
    if (settings.doNotDisturb && settings.turnOffDoNotDisturbAt) {
      const turnOffTime = dayjs(settings.turnOffDoNotDisturbAt);
      if (dayjs().isAfter(turnOffTime)) {
        updateSettings({
          doNotDisturb: false,
          turnOffDoNotDisturbAt: null,
        });
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

  const handleDoNotDisturbChange = useCallback(
    (checked: boolean) => {
      updateSettings({
        doNotDisturb: checked,
        turnOffDoNotDisturbAt: null,
      });
    },
    [updateSettings],
  );

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setSelectedDate(
      settings.turnOffDoNotDisturbAt
        ? dayjs(settings.turnOffDoNotDisturbAt)
        : null,
    );
    setDateError(null);
  }, [settings]);

  const handleSubmit = useCallback(() => {
    if (!selectedDate || !selectedDate.isAfter(dayjs().add(1, 'minute'))) {
      setDateError('Turn off time must be at least 1 minute in the future');
      return;
    }

    updateSettings({
      doNotDisturb: true,
      turnOffDoNotDisturbAt: selectedDate.toISOString(),
    });
    setDialogOpen(false);
    setDateError(null);
  }, [selectedDate, updateSettings]);

  if (isLoading) {
    return <DashboardItem size="sm" loading />;
  }

  return (
    <>
      <DashboardItem
        size="sm"
        cardTitle="Do Not Disturb"
        cardSubheader={subHeaderText}
        speedDialActions={[
          {
            name: 'View all',
            icon: <ListAltIcon />,
            onClick: () => navigate('/do-not-disturb'),
          },
        ]}
        cardContent={
          <Box
            height="100%"
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
          >
            {settings.doNotDisturb && (
              <Box display="flex" justifyContent="center" mb={2}>
                <Button
                  variant="outlined"
                  onClick={() => setDialogOpen(true)}
                  size="small"
                  endIcon={<TimerIcon />}
                >
                  {settings.turnOffDoNotDisturbAt
                    ? 'Change Off At'
                    : 'Turn Off At'}
                </Button>
              </Box>
            )}
            <Box display="flex" justifyContent="center" alignItems="center">
              <Box display="flex" alignItems="center" gap={1}>
                {settings.doNotDisturb ? (
                  <DoNotDisturbOnIcon />
                ) : (
                  <DoNotDisturbOffIcon />
                )}
                <Switch
                  checked={settings.doNotDisturb}
                  onChange={(e) => handleDoNotDisturbChange(e.target.checked)}
                />
                <Typography>{settings.doNotDisturb ? 'On' : 'Off'}</Typography>
              </Box>
            </Box>
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
