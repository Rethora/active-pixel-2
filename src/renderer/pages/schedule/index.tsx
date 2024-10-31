import { Suspense, useReducer } from 'react';
import { makeLoader, useLoaderData, Await } from 'react-router-typesafe';
import { Link, useSubmit } from 'react-router-dom';
import {
  Dialog,
  Box,
  Button,
  DialogTitle,
  IconButton,
  Switch,
  Tooltip,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Schedule } from '../../../shared/types/schedule';
import Loading from '../../components/Loading';
import { getHumanReadableTimeSchedule } from '../../../shared/util/cron';

export const scheduleLoader = makeLoader(async () => ({
  schedulesPromise: window.electron.store.getSchedules(),
}));

type DeleteDialogState = {
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
  const submit = useSubmit();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Are you sure you want to delete this schedule?</DialogTitle>
      <DialogContent>You can always disable it instead.</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            submit(
              {},
              {
                method: 'DELETE',
                action: `/schedule/edit/${scheduleId}`,
              },
            );
            onClose();
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ScheduleItem({
  schedule,
  onDelete,
}: {
  schedule: Schedule;
  onDelete: (id: string) => void;
}) {
  const submit = useSubmit();

  return (
    <TableRow key={schedule.id}>
      <TableCell>{schedule.name}</TableCell>
      <TableCell>{getHumanReadableTimeSchedule(schedule.time)}</TableCell>
      <TableCell>
        <Switch
          name="enabled"
          checked={schedule.enabled}
          onChange={(e) => {
            submit(
              { enabled: e.target.checked ? 'on' : 'off' },
              {
                method: 'PATCH',
                action: `/schedule/edit/${schedule.id}`,
              },
            );
          }}
        />
      </TableCell>
      <TableCell>
        <Box display="flex" justifyContent="center">
          <Link to={`/schedule/edit/${schedule.id}`}>
            <Tooltip title="Edit">
              <IconButton>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Link>
          <Tooltip title="Delete">
            <IconButton onClick={() => onDelete(schedule.id)}>
              <DeleteIcon color="error" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
}

function ScheduleList({ schedules }: { schedules: Schedule[] }) {
  const [deleteDialog, setDeleteDialog] = useReducer(
    (state: DeleteDialogState, action: DeleteDialogState) => ({
      ...state,
      ...action,
    }),
    { open: false, scheduleId: '' },
  );

  if (schedules.length === 0) {
    return <div>No schedules found</div>;
  }

  const handleDelete = (id: string) => {
    setDeleteDialog({
      open: true,
      scheduleId: id,
    });
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule) => (
              <ScheduleItem
                key={schedule.id}
                schedule={schedule}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DeleteDialog
        open={deleteDialog.open}
        scheduleId={deleteDialog.scheduleId}
        onClose={() => setDeleteDialog({ open: false, scheduleId: '' })}
      />
    </Box>
  );
}

export default function SchedulePage() {
  const { schedulesPromise } = useLoaderData<typeof scheduleLoader>();

  return (
    <Box>
      <Suspense fallback={<Loading />}>
        <Await resolve={schedulesPromise}>
          {(schedules) => {
            console.log('schedules', schedules);
            return (
              <Box>
                <Box display="flex" justifyContent="flex-end" mb={2}>
                  <Link to="/schedule/new">
                    <Button endIcon={<AddIcon />}>Add Schedule</Button>
                  </Link>
                </Box>
                <ScheduleList schedules={schedules} />
              </Box>
            );
          }}
        </Await>
      </Suspense>
    </Box>
  );
}
