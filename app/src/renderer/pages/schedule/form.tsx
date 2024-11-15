import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { FormMethod } from '../../types/form';
import FormItem from '../../components/FormItem';
import {
  PartialScheduleWithoutId,
  Schedule,
  ScheduleWithoutId,
} from '../../../shared/types/schedule';
import CronScheduler from '../../components/CronScheduler';
import FilterSelector from '../../components/FilterSelector';
import useForm from '../../hooks/useForm';
import {
  useAddScheduleMutation,
  useUpdateScheduleMutation,
} from '../../slices/schedulesSlice';
import Loading from '../../components/Loading';

type ScheduleFormProps = {
  schedule?: Schedule | PartialScheduleWithoutId;
  method: FormMethod;
  id?: string;
} & (
  | { method: 'POST' }
  | { method: 'PATCH'; id: string; schedule: PartialScheduleWithoutId }
  | { method: 'PUT'; id: string; schedule: ScheduleWithoutId }
  | { method: 'DELETE'; id: string }
);

export default function ScheduleForm({
  method,
  schedule,
  id,
}: ScheduleFormProps) {
  const navigate = useNavigate();
  const [
    addSchedule,
    { isLoading: isAddingSchedule, isSuccess: isAddedSchedule },
  ] = useAddScheduleMutation();
  const [
    updateSchedule,
    { isLoading: isUpdatingSchedule, isSuccess: isUpdatedSchedule },
  ] = useUpdateScheduleMutation();
  const { values, setValue, getChangedValues, hasErrors } =
    useForm<ScheduleWithoutId>({
      initialValues: {
        name: '',
        time: '0 * * * *',
        enabled: true,
        filters: {},
        silenceNotificationsUntil: null,
        ...schedule,
      },
      validationRules: {
        name: (value) => {
          if (value.length === 0) {
            return 'Name is required';
          }
          return undefined;
        },
      },
    });
  const [numberOfResults, setNumberOfResults] = useState(0);

  useEffect(() => {
    if (isAddedSchedule || isUpdatedSchedule) {
      enqueueSnackbar('Schedule saved successfully', {
        variant: 'success',
      });
      navigate('/schedules');
    }
  }, [isAddedSchedule, isUpdatedSchedule, navigate]);

  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue('name', e.target.value);
    },
    [setValue],
  );

  const handleEnabledChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue('enabled', e.target.checked);
    },
    [setValue],
  );

  const handleTimeChange = useCallback(
    (time: string) => {
      setValue('time', time);
    },
    [setValue],
  );

  const handleFiltersChange = useCallback(
    (newFilters: any) => {
      setValue('filters', newFilters);
    },
    [setValue],
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (method === 'POST') {
        addSchedule(values);
      } else if (method === 'PUT') {
        updateSchedule({ id, updatedSchedule: getChangedValues() });
      }
    },
    [addSchedule, values, method, getChangedValues, id, updateSchedule],
  );

  if (isAddingSchedule || isUpdatingSchedule) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={4}>
        <Box mb={2}>
          <Typography variant="subtitle1">
            Schedule a time to receive a random suggestion for an activity based
            on the filters
          </Typography>
        </Box>
      </Box>
      <FormItem>
        <Box maxWidth="500px">
          <TextField
            name="name"
            label="Name"
            value={values.name}
            onChange={handleNameChange}
            placeholder="This is what will appear in the notification"
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
              onChange={handleEnabledChange}
            />
          }
          label="Enabled"
        />
      </FormItem>
      <FormItem>
        <CronScheduler value={values.time} setValue={handleTimeChange} />
      </FormItem>
      <FormItem>
        <FilterSelector
          filters={values.filters}
          onFiltersChange={handleFiltersChange}
          onNumberOfResultsChange={setNumberOfResults}
        />
      </FormItem>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          endIcon={<SaveIcon />}
          disabled={numberOfResults === 0 || hasErrors()}
        >
          Save
        </Button>
      </Box>
    </form>
  );
}
