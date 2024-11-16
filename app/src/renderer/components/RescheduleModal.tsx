import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import dayjs from 'dayjs';
import { parseExpression } from 'cron-parser';
import { DateTimePicker } from '@mui/x-date-pickers';
import CronScheduler from './CronScheduler';
import { Reschedule, Schedule } from '../../shared/types/schedule';
import useForm from '../hooks/useForm';

type PresetOption = 'nextRun' | 'hour' | 'day' | 'week' | 'custom';

const getPresetEndTime = (
  preset: PresetOption,
  cronExpression?: string,
): Date => {
  const now = new Date();
  switch (preset) {
    case 'nextRun':
      if (cronExpression) {
        try {
          const interval = parseExpression(cronExpression, {
            currentDate: new Date(now.getTime() - 1000),
          });
          return interval.next().toDate();
        } catch (error) {
          return now;
        }
      }
      return now;
    case 'hour':
      return dayjs(now).add(1, 'hour').toDate();
    case 'day':
      return dayjs(now).endOf('day').toDate();
    case 'week':
      return dayjs(now).endOf('week').toDate();
    default:
      return now;
  }
};

export default function RescheduleModal({
  open,
  onClose,
  schedule,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  schedule: Schedule;
  onSubmit: (reschedule: Reschedule) => void;
}) {
  const { values, setValue } = useForm<Schedule>({
    initialValues: {
      ...schedule,
      rescheduled: {
        originalTime: schedule.time,
        newTime: schedule.time,
        endTime: getPresetEndTime('nextRun', schedule.time).toISOString(),
        createdAt: new Date().toISOString(),
      },
    },
  });
  const [preset, setPreset] = useState<PresetOption>('nextRun');

  const handlePresetChange = (newPreset: PresetOption) => {
    setPreset(newPreset);
    if (newPreset !== 'custom') {
      setValue(
        'rescheduled.endTime',
        getPresetEndTime(newPreset, values.rescheduled?.newTime).toISOString(),
      );
    } else {
      setValue('rescheduled.endTime', null);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          zIndex: 1300,
        },
      }}
    >
      <DialogTitle>Reschedule {schedule?.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={1}>
          <Box
            sx={{
              '& .MuiPopover-root': {
                zIndex: 1400,
              },
            }}
          >
            <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                Temporarily change when you&apos;ll receive notifications for
                this schedule.
              </Typography>
              <Tooltip title="Useful for catching up on missed notifications or adjusting for upcoming busy periods, without modifying your original schedule">
                <IconButton>
                  <InfoOutlined />
                </IconButton>
              </Tooltip>
            </Box>
            <CronScheduler
              value={values.rescheduled?.newTime ?? '* * * * *'}
              setValue={(value) => {
                const update = { ...values.rescheduled };
                update.newTime = value;
                // Update end time if preset is nextRun
                if (preset === 'nextRun') {
                  update.endTime = getPresetEndTime(
                    'nextRun',
                    value,
                  ).toISOString();
                }
                setValue('rescheduled', update);
              }}
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel id="reschedule-duration-label">
              Reschedule Duration
            </InputLabel>
            <Select
              labelId="reschedule-duration-label"
              value={preset}
              label="Reschedule Duration"
              onChange={(e) =>
                handlePresetChange(e.target.value as PresetOption)
              }
            >
              <MenuItem value="nextRun">Until next rescheduled run</MenuItem>
              <MenuItem value="hour">For the next hour</MenuItem>
              <MenuItem value="day">For the rest of the day</MenuItem>
              <MenuItem value="week">For the rest of the week</MenuItem>
              <MenuItem value="custom">Custom duration</MenuItem>
            </Select>
          </FormControl>

          {preset === 'custom' && (
            <DateTimePicker
              label="Until When?"
              value={
                values.rescheduled?.endTime
                  ? dayjs(values.rescheduled.endTime)
                  : null
              }
              onChange={(value) =>
                setValue('rescheduled.endTime', value?.toDate() ?? null)
              }
              minDateTime={dayjs(new Date())}
              sx={{
                '& .MuiPopover-root': {
                  zIndex: 1400,
                },
              }}
            />
          )}
          {values.rescheduled?.endTime && (
            <Typography variant="body2" color="text.secondary">
              This schedule will return to normal at{' '}
              {new Date(values.rescheduled.endTime).toLocaleString()}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            if (!values.rescheduled?.endTime) return;
            onSubmit({
              originalTime: schedule?.time ?? '',
              newTime: values.rescheduled.newTime ?? '',
              endTime: values.rescheduled.endTime,
              createdAt: new Date().toISOString(),
            });
            onClose();
          }}
          variant="contained"
          disabled={!values.rescheduled?.endTime}
        >
          Reschedule
        </Button>
      </DialogActions>
    </Dialog>
  );
}
