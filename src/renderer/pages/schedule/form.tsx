import { Form, redirect } from 'react-router-dom';
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useRef, useState } from 'react';
import { makeAction } from 'react-router-typesafe';
import { FormMethod } from '../../types/form';
import FormItem from '../../components/FormItem';
import { Schedule } from '../../../shared/types/schedule';
import CronScheduler from '../../components/CronScheduler';
import FilterSelector from '../../components/FilterSelector';
import { getSuggestionsWithFilters } from '../../../shared/suggestion';

type ScheduleFormProps = {
  method: FormMethod;
  schedule?: Schedule | Omit<Schedule, 'id'>;
};

export const scheduleFormActions = makeAction(async ({ request }) => {
  const formData = await request.formData();
  const formDataEntries = Object.fromEntries(formData);
  const errors: string[] = [];
  const filters = JSON.parse(formDataEntries.filters.toString());
  const numberOfSuggestions = getSuggestionsWithFilters(filters).length;
  if (numberOfSuggestions === 0) {
    return {
      errors: ['No suggestions found for this schedule'],
    };
  }
  if (request.method === 'POST') {
    const schedule: Omit<Schedule, 'id'> = {
      name: formDataEntries.name.toString(),
      enabled: formDataEntries.enabled.toString() === 'on',
      filters,
      time: formDataEntries.time.toString(),
    };
    try {
      window.electron.store.addSchedule(schedule);
      return redirect('/schedule');
    } catch (error) {
      errors.push('Failed to create schedule');
    }
  }
  return {
    errors,
  };
});

export default function ScheduleForm({
  method,
  schedule = {
    name: '',
    enabled: true,
    filters: {},
    time: '',
  },
}: ScheduleFormProps) {
  const scheduleRef = useRef(schedule); // * prevent component changing default state error
  const [time, setTime] = useState('0 * * * *');
  const [filters, setFilters] = useState(
    scheduleRef.current.filters || {
      force: ['push'],
    },
  );

  return (
    <Form method={method}>
      <Box mb={4}>
        <Box my={2}>
          <Typography variant="subtitle1">
            Create a new schedule to get a random filtered suggestion
          </Typography>
        </Box>
        <Box my={2}>
          <Typography variant="subtitle2">
            (If a category doesn&apos;t have any items checked, it is assumed to
            include all of the filters in that category)
          </Typography>
        </Box>
      </Box>
      <FormItem>
        <Box maxWidth="500px">
          <TextField
            name="name"
            label="Name"
            defaultValue={scheduleRef.current.name}
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
              defaultChecked={scheduleRef.current.enabled}
            />
          }
          label="Enabled"
        />
      </FormItem>
      <FormItem>
        <CronScheduler value={time} setValue={setTime} />
        <input type="hidden" name="time" value={time} />
      </FormItem>
      <FormItem>
        <FilterSelector
          filters={filters}
          onFiltersChange={(newFilters) => setFilters(newFilters)}
        />
      </FormItem>
      <input type="hidden" name="filters" value={JSON.stringify(filters)} />
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit">Save</Button>
      </Box>
    </Form>
  );
}
