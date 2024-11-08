import { useCallback, useMemo } from 'react';
import { Box, Checkbox, IconButton, Tooltip } from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import { GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import {
  useGetDailyProgressQuery,
  useToggleNotificationCompletionMutation,
} from '../../slices/progressSlice';
import { HandlerReturn } from '../../../shared/types/ipc';
import { useGetScheduleQuery } from '../../slices/schedulesSlice';
import {
  setCurrentFilters,
  useGetAllSuggestionsWithAddPropsQuery,
} from '../../slices/suggestionsSlice';
import { getRandomSuggestion } from '../../../shared/util/suggestion';
import { useAppDispatch } from '../../store/hooks';
import DataGrid from '../../components/DataGrid';

function ActionsCell({ scheduleId }: { scheduleId: string }) {
  const { data: suggestions } = useGetAllSuggestionsWithAddPropsQuery();
  const { data: schedule } = useGetScheduleQuery(scheduleId);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleOnGetSuggestion = useCallback(() => {
    if (!schedule || !suggestions) return;
    const suggestion = getRandomSuggestion({
      suggestionsWithAddProps: suggestions,
      filters: schedule.filters,
    });
    if (!suggestion) return;
    dispatch(setCurrentFilters(schedule.filters));
    navigate(`/suggestions/${suggestion.id}`);
  }, [schedule, suggestions, dispatch, navigate]);

  return (
    <Box>
      <Tooltip title="Get a Suggestion">
        <IconButton onClick={handleOnGetSuggestion}>
          <CasinoIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default function DailyProgressPage() {
  const {
    data: dailyProgress = {} as HandlerReturn<'get-daily-progress'>,
    isLoading,
  } = useGetDailyProgressQuery(undefined, {
    pollingInterval: 60000,
  });
  const [toggleNotificationCompletion] =
    useToggleNotificationCompletionMutation();

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'scheduleName',
        headerName: 'Schedule',
        flex: 1,
      },
      {
        field: 'timestamp',
        headerName: 'Time',
        flex: 1,
        valueFormatter: (_, row) => dayjs(row.timestamp).format('h:mm A'),
      },
      {
        field: 'wasShown',
        headerName: 'Notification Shown',
        flex: 1,
        renderCell: (params) => (params.value ? 'Yes' : 'No'),
      },
      {
        field: 'completed',
        headerName: 'Completed',
        flex: 1,
        renderCell: (params) => (
          <Checkbox
            checked={params.row.completed}
            onChange={async () => {
              await toggleNotificationCompletion(params.row.id);
            }}
          />
        ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        renderCell: (params) => (
          <ActionsCell scheduleId={params.row.scheduleId} />
        ),
      },
    ],
    [toggleNotificationCompletion],
  );

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <DataGrid
        muiDataGridProps={{
          rows: dailyProgress.notifications,
          columns,
          loading: isLoading,
          disableRowSelectionOnClick: true,
        }}
      />
    </Box>
  );
}
