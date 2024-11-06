import { useCallback, useMemo } from 'react';
import { Box, Checkbox, IconButton, Tooltip } from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DashboardItem from '../components/DashboardItem';
import {
  useGetDailyProgressQuery,
  useToggleNotificationCompletionMutation,
} from '../../../slices/progressSlice';
import { useGetScheduleQuery } from '../../../slices/schedulesSlice';
import {
  setCurrentFilters,
  useGetAllSuggestionsWithAddPropsQuery,
} from '../../../slices/suggestionsSlice';
import { getRandomSuggestion } from '../../../../shared/util/suggestion';
import { useAppDispatch } from '../../../store/hooks';

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
    <Tooltip title="Get a Suggestion">
      <IconButton size="small" onClick={handleOnGetSuggestion}>
        <CasinoIcon />
      </IconButton>
    </Tooltip>
  );
}

export default function DailyProgressList() {
  const { data: dailyProgress, isLoading } = useGetDailyProgressQuery(
    undefined,
    {
      pollingInterval: 60000,
    },
  );
  const [toggleNotificationCompletion] =
    useToggleNotificationCompletionMutation();
  const navigate = useNavigate();

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'scheduleName',
        headerName: 'Schedule',
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'timestamp',
        headerName: 'Time',
        width: 100,
        valueGetter: (_, row) => {
          return dayjs(row.timestamp).format('h:mm A');
        },
      },
      {
        field: 'completed',
        headerName: 'Done',
        width: 70,
        renderCell: (params) => (
          <Checkbox
            size="small"
            checked={params.row.completed}
            onChange={() => toggleNotificationCompletion(params.row.id)}
          />
        ),
      },
      {
        field: 'actions',
        headerName: '',
        width: 50,
        renderCell: (params) => (
          <ActionsCell scheduleId={params.row.scheduleId} />
        ),
        sortable: false,
        filterable: false,
      },
    ],
    [toggleNotificationCompletion],
  );

  return (
    <DashboardItem
      size="md"
      cardTitle="Today's Tasks"
      cardSubheader="Quick access to today's notifications"
      speedDialActions={[
        {
          name: 'View all',
          icon: <ListAltIcon />,
          onClick: () => navigate('/progress'),
        },
      ]}
      cardContent={
        <Box height={370}>
          <DataGrid
            rows={dailyProgress?.notifications ?? []}
            columns={columns}
            loading={isLoading}
            disableRowSelectionOnClick
            density="compact"
            hideFooter
          />
        </Box>
      }
    />
  );
}
