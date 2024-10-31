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
import { enqueueSnackbar } from 'notistack';
import { FormMethod } from '../../types/form';
import FormItem from '../../components/FormItem';
import {
  PartialScheduleWithoutId,
  Schedule,
  ScheduleWithoutId,
} from '../../../shared/types/schedule';
import CronScheduler from '../../components/CronScheduler';
import FilterSelector from '../../components/FilterSelector';
import { getSuggestionsWithFilters } from '../../../shared/suggestion';

type ScheduleFormProps = {
  method: FormMethod;
  schedule?: Schedule | PartialScheduleWithoutId;
};

export const scheduleFormActions = makeAction(async ({ request, params }) => {
  const formData = await request.formData();
  const formDataEntries = Object.fromEntries(formData);
  let errorMessage = 'An unknown error occurred';
  if (request.method === 'PATCH') {
    try {
      const scheduleUpdate: PartialScheduleWithoutId = {};
      if (formDataEntries.enabled) {
        scheduleUpdate.enabled = formDataEntries.enabled === 'on';
      }
      if (formDataEntries.silenceNotificationsUntil) {
        scheduleUpdate.silenceNotificationsUntil =
          formDataEntries.silenceNotificationsUntil.toString();
      }
      if (formDataEntries.silenceNotificationsUntil) {
        scheduleUpdate.silenceNotificationsUntil =
          formDataEntries.silenceNotificationsUntil === 'null'
            ? null
            : formDataEntries.silenceNotificationsUntil.toString();
      }
      window.electron.store.updateSchedule(params.id ?? '', scheduleUpdate);
      return redirect('/schedule');
    } catch (error) {
      errorMessage = 'Failed to update schedule';
    }
  }
  if (request.method === 'DELETE') {
    try {
      window.electron.store.deleteSchedule(params.id ?? '');
      return redirect('/schedule');
    } catch (error) {
      errorMessage = 'Failed to delete schedule';
    }
  }
  const filters = JSON.parse(formDataEntries.filters.toString());
  const numberOfSuggestions = getSuggestionsWithFilters(filters).length;
  if (numberOfSuggestions === 0) {
    return {
      errors: ['No suggestions found for this schedule'],
    };
  }
  if (request.method === 'POST') {
    try {
      const schedule: ScheduleWithoutId = {
        name: formDataEntries.name.toString(),
        enabled: formDataEntries.enabled === 'on',
        filters,
        time: formDataEntries.time.toString(),
        silenceNotificationsUntil: null,
      };
      window.electron.store.addSchedule(schedule);
      return redirect('/schedule');
    } catch (error) {
      errorMessage = 'Failed to create schedule';
    }
  }
  if (request.method === 'PUT') {
    try {
      const schedule: PartialScheduleWithoutId = {
        name: formDataEntries.name.toString(),
        enabled: formDataEntries.enabled === 'on',
        filters,
        time: formDataEntries.time.toString(),
      };
      window.electron.store.updateSchedule(params.id ?? '', schedule);
      return redirect('/schedule');
    } catch (error) {
      errorMessage = 'Failed to update schedule';
    }
  }

  enqueueSnackbar(errorMessage, { variant: 'error' });
  return {
    error: errorMessage,
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
  const [filters, setFilters] = useState(scheduleRef.current.filters || {});
  const [time, setTime] = useState(scheduleRef.current.time || '0 * * * *');

  return (
    <Form method={method}>
      <Box mb={4}>
        <Box mb={2}>
          <Typography variant="subtitle1">
            Schedule a time to receive a random suggestion for an activity based
            on the filters
          </Typography>
        </Box>
        <Box>
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
