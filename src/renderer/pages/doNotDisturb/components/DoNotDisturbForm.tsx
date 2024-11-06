import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormEvent, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';
import {
  DayOfWeek,
  DoNotDisturbSchedule,
  DoNotDisturbScheduleTime,
  DoNotDisturbScheduleWithoutId,
} from '../../../../shared/types/doNotDisturbSchedules';
import { FormMethod } from '../../../types/form';
import FormItem from '../../../components/FormItem';
import useForm from '../../../hooks/useForm';
import {
  useAddDoNotDisturbScheduleMutation,
  useUpdateDoNotDisturbScheduleMutation,
} from '../../../slices/doNotDisturbSchedulesSlice';
import Loading from '../../../components/Loading';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;

type DoNotDisturbFormProps = {
  schedule?: DoNotDisturbSchedule;
  method: FormMethod;
  id?: string;
};

export default function DoNotDisturbForm({
  method,
  schedule,
  id,
}: DoNotDisturbFormProps) {
  const navigate = useNavigate();
  const [addSchedule, { isLoading: isAdding, isSuccess: isAdded }] =
    useAddDoNotDisturbScheduleMutation();
  const [updateSchedule, { isLoading: isUpdating, isSuccess: isUpdated }] =
    useUpdateDoNotDisturbScheduleMutation();

  const { values, setValue, getChangedValues } =
    useForm<DoNotDisturbScheduleWithoutId>({
      initialValues: {
        name: '',
        days: [],
        times: [{ startTime: '09:00', endTime: '17:00' }],
        enabled: true,
        ...schedule,
      },
    });

  useEffect(() => {
    if (isAdded || isUpdated) {
      enqueueSnackbar('Schedule saved successfully', { variant: 'success' });
      navigate('/do-not-disturb');
    }
  }, [isAdded, isUpdated, navigate]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (method === 'POST') {
        addSchedule(values);
      } else if (method === 'PUT' && id) {
        updateSchedule({ id, updatedSchedule: getChangedValues() });
      }
    },
    [addSchedule, values, method, getChangedValues, id, updateSchedule],
  );

  const handleAddTimeRange = useCallback(() => {
    setValue('times', [
      ...values.times,
      { startTime: '09:00', endTime: '17:00' },
    ]);
  }, [setValue, values.times]);

  const handleRemoveTimeRange = useCallback(
    (index: number) => {
      setValue(
        'times',
        values.times.filter((_, i) => i !== index),
      );
    },
    [setValue, values.times],
  );

  const handleTimeChange = useCallback(
    (index: number, type: keyof DoNotDisturbScheduleTime, value: string) => {
      setValue(
        'times',
        values.times.map((time, i) =>
          i === index ? { ...time, [type]: value } : time,
        ),
      );
    },
    [setValue, values.times],
  );

  if (isAdding || isUpdating) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={4}>
        <Typography variant="subtitle1">
          Create a schedule for times when you don&apos;t want to be disturbed
        </Typography>
        <Typography variant="subtitle1">
          This will silence ALL notifications for that time frame
        </Typography>
      </Box>
      <FormItem>
        <Box maxWidth="500px">
          <TextField
            name="name"
            label="Name"
            value={values.name}
            onChange={(e) => setValue('name', e.target.value)}
            placeholder="e.g., Work Hours"
            required
            fullWidth
          />
        </Box>
      </FormItem>
      <FormItem>
        <FormControlLabel
          control={
            <Switch
              name="enabled"
              checked={values.enabled}
              onChange={(e) => setValue('enabled', e.target.checked)}
            />
          }
          label="Enabled"
        />
      </FormItem>
      <FormItem>
        <Box maxWidth="500px">
          <FormControl fullWidth>
            <InputLabel>Days</InputLabel>
            <Select
              multiple
              value={values.days}
              onChange={(e) => setValue('days', e.target.value as DayOfWeek[])}
              label="Days"
              required
            >
              {DAYS.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </FormItem>
      <FormItem>
        <Typography variant="h6" gutterBottom>
          Time Ranges
        </Typography>
        {values.times.map((time, index) => (
          <Box
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            display="flex"
            alignItems="center"
            gap={2}
            mb={2}
            maxWidth="500px"
          >
            <TimePicker
              label="Start Time"
              value={dayjs()
                .set('hour', parseInt(time.startTime.split(':')[0], 10))
                .set('minute', parseInt(time.startTime.split(':')[1], 10))}
              onChange={(newValue) => {
                if (newValue) {
                  handleTimeChange(
                    index,
                    'startTime',
                    newValue.format('HH:mm'),
                  );
                }
              }}
            />
            <TimePicker
              label="End Time"
              value={dayjs()
                .set('hour', parseInt(time.endTime.split(':')[0], 10))
                .set('minute', parseInt(time.endTime.split(':')[1], 10))}
              onChange={(newValue) => {
                if (newValue) {
                  handleTimeChange(index, 'endTime', newValue.format('HH:mm'));
                }
              }}
            />
            {values.times.length > 1 && (
              <IconButton
                onClick={() => handleRemoveTimeRange(index)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddTimeRange}
          variant="outlined"
          size="small"
        >
          Add Time Range
        </Button>
      </FormItem>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Box>
    </form>
  );
}
