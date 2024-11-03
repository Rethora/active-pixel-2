import { Suspense, useRef } from 'react';
import { useSubmit } from 'react-router-dom';
import { Typography, Checkbox } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Await } from 'react-router-typesafe';
import dayjs from 'dayjs';
import useMinuteTimer from '../../hooks/useMinuteTimer';
import Loading from '../../components/Loading';

export default function ScheduleProgressPage() {
  const submit = useSubmit();
  const dailyProgressPromise = window.electron.store.getDailyProgress();

  const nowRef = useRef(new Date());

  useMinuteTimer(() => {
    nowRef.current = new Date();
  });

  const columns: GridColDef[] = [
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
      renderCell: (params) => (
        <Typography color={params.value ? 'success.main' : 'error.main'}>
          {params.value ? 'Yes' : 'No'}
        </Typography>
      ),
    },
    {
      field: 'completed',
      headerName: 'Completed',
      flex: 1,
      renderCell: (params) => (
        <Checkbox
          checked={params.row.completed}
          onChange={async () => {
            submit(
              { id: params.row.id },
              { method: 'PUT', action: '/schedule/progress' },
            );
          }}
        />
      ),
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={dailyProgressPromise}>
        {(dailyProgress) => (
          <DataGrid
            rows={dailyProgress?.notifications || []}
            columns={columns}
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
            key={nowRef.current.getTime()} // Force re-render every minute
          />
        )}
      </Await>
    </Suspense>
  );
}
