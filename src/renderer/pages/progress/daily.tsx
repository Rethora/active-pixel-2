import { useMemo } from 'react';
import { Checkbox } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';

import {
  useGetDailyProgressQuery,
  useToggleNotificationCompletionMutation,
} from '../../slices/progressSlice';
import { HandlerReturn } from '../../../shared/types/ipc';

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
    ],
    [toggleNotificationCompletion],
  );

  return (
    <DataGrid
      rows={dailyProgress.notifications}
      columns={columns}
      loading={isLoading}
      pageSizeOptions={[5, 10, 25]}
      initialState={{
        pagination: {
          paginationModel: {
            page: 0,
            pageSize: 25,
          },
        },
      }}
      disableRowSelectionOnClick
      autoHeight
    />
  );
}
