import { useMemo, useReducer } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  IconButton,
  Switch,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from '../../../components/Loading';
import DataGrid from '../../../components/DataGrid';
import {
  useDeleteDoNotDisturbScheduleMutation,
  useGetDoNotDisturbSchedulesQuery,
  useUpdateDoNotDisturbScheduleMutation,
} from '../../../slices/doNotDisturbSchedulesSlice';
import { DoNotDisturbScheduleTime } from '../../../../shared/types/doNotDisturbSchedules';

type DialogState = {
  open: boolean;
  scheduleId: string;
};

function DeleteDialog({
  open,
  scheduleId,
  onClose,
}: {
  open: boolean;
  scheduleId: string;
  onClose: () => void;
}) {
  const [deleteSchedule] = useDeleteDoNotDisturbScheduleMutation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Are you sure you want to delete this schedule?</DialogTitle>
      <DialogContent>
        <DialogContentText>This action cannot be undone.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            deleteSchedule(scheduleId);
            onClose();
          }}
          endIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function DoNotDisturbList({
  heightSubtraction,
}: {
  heightSubtraction: number | undefined;
}) {
  const { data: schedules = [], isLoading } =
    useGetDoNotDisturbSchedulesQuery();
  const [updateSchedule] = useUpdateDoNotDisturbScheduleMutation();
  const [deleteDialog, setDeleteDialog] = useReducer(
    (state: DialogState, setState: DialogState) => ({
      ...state,
      ...setState,
    }),
    { open: false, scheduleId: '' },
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: 'name', headerName: 'Name', flex: 1 },
      {
        field: 'days',
        headerName: 'Days',
        flex: 1,
        valueGetter: (_, row) => row.days.join(', '),
      },
      {
        field: 'times',
        headerName: 'Times',
        flex: 1,
        valueGetter: (_, row) =>
          row.times
            .map((t: DoNotDisturbScheduleTime) => {
              const formatTime = (time: string) => {
                const [hours, minutes] = time.split(':');
                const hour = parseInt(hours, 10);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const hour12 = hour % 12 || 12;
                return `${hour12}:${minutes} ${ampm}`;
              };
              return `${formatTime(t.startTime)} - ${formatTime(t.endTime)}`;
            })
            .join(', '),
      },
      {
        field: 'enabled',
        headerName: 'Enabled',
        width: 100,
        renderCell: (params) => (
          <Switch
            checked={params.row.enabled}
            onChange={(e) => {
              updateSchedule({
                id: params.row.id,
                updatedSchedule: { enabled: e.target.checked },
              });
            }}
          />
        ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        renderCell: (params) => (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Link to={`/do-not-disturb/edit/${params.row.id}`}>
              <Tooltip title="Edit">
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Link>
            <Tooltip title="Delete">
              <IconButton
                onClick={() =>
                  setDeleteDialog({ open: true, scheduleId: params.row.id })
                }
              >
                <DeleteIcon color="error" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [updateSchedule],
  );

  if (isLoading) {
    return <Loading />;
  }

  if (schedules.length === 0) {
    return <div>No schedules found</div>;
  }

  return (
    <Box>
      <DataGrid
        muiDataGridProps={{
          rows: schedules,
          columns,
          loading: isLoading,
          disableRowSelectionOnClick: true,
        }}
        heightSubtraction={heightSubtraction}
      />
      <DeleteDialog
        open={deleteDialog.open}
        scheduleId={deleteDialog.scheduleId}
        onClose={() => setDeleteDialog({ open: false, scheduleId: '' })}
      />
    </Box>
  );
}
