import { Suspense, useMemo, useReducer, useState } from 'react';
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
  useMediaQuery,
  useTheme,
  Typography,
  DialogContentText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Schedule } from '../../../shared/types/schedule';
import Loading from '../../components/Loading';
import { getHumanReadableTimeSchedule } from '../../../shared/util/cron';

export const scheduleLoader = makeLoader(async () => ({
  schedulesPromise: window.electron.store.getSchedules(),
}));

type DialogState = {
  open: boolean;
  scheduleId: string;
};

type DialogProps = {
  open: boolean;
  scheduleId: string;
  onClose: () => void;
};

function UnSilenceNotificationsDialog({
  open,
  onClose,
  scheduleId,
  scheduleName,
}: DialogProps & { scheduleName: string }) {
  const submit = useSubmit();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Unsilence notifications for &quot;{scheduleName}&quot;?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          This will turn back on notifications for this schedule.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            submit(
              {
                silenceNotificationsUntil: null,
              },
              { method: 'PATCH', action: `/schedule/edit/${scheduleId}` },
            );
            onClose();
          }}
        >
          Unsilence
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function SilenceNotificationsDialog({
  open,
  scheduleId,
  onClose,
  scheduleName,
}: DialogProps & { scheduleName: string }) {
  const submit = useSubmit();
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const theme = useTheme();

  const smallWidth = useMediaQuery(theme.breakpoints.down('sm'));
  const smallHeight = useMediaQuery('(max-height: 850px)');
  const fullScreen = useMemo(
    () => smallWidth || smallHeight,
    [smallWidth, smallHeight],
  );

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen}>
      <DialogTitle>
        Silence Notifications for &quot;{scheduleName}&quot;
      </DialogTitle>
      <DialogContent sx={{ maxWidth: 'xs' }}>
        <Typography variant="body2" maxWidth="xs">
          This will override any existing silence for this schedule.
        </Typography>
        <Box p={4}>
          <DateTimePicker
            label="Until When?"
            value={date?.set('second', 0)}
            onChange={(value) => setDate(value?.set('second', 0) ?? null)}
            minDateTime={dayjs().set('second', 0)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            submit(
              { silenceNotificationsUntil: date?.toISOString() ?? null },
              {
                method: 'PATCH',
                action: `/schedule/edit/${scheduleId}`,
              },
            );
            onClose();
          }}
        >
          Silence
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DeleteDialog({ open, scheduleId, onClose }: DialogProps) {
  const submit = useSubmit();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Are you sure you want to delete this schedule?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can always disable it instead.
        </DialogContentText>
      </DialogContent>
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
  onSilenceNotifications,
  onUnSilenceNotifications,
}: {
  schedule: Schedule;
  onDelete: (id: string) => void;
  onSilenceNotifications: (id: string, name: string) => void;
  onUnSilenceNotifications: (id: string) => void;
}) {
  const submit = useSubmit();
  const pastSilenceUntil = useMemo(
    () =>
      Boolean(
        schedule.silenceNotificationsUntil &&
          new Date() > new Date(schedule.silenceNotificationsUntil),
      ),
    [schedule.silenceNotificationsUntil],
  );

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
          <Tooltip
            title={
              schedule.silenceNotificationsUntil && !pastSilenceUntil
                ? `Notifications silenced until ${new Date(
                    schedule.silenceNotificationsUntil,
                  ).toLocaleString()}`
                : 'Silence notifications'
            }
          >
            <IconButton
              color={
                schedule.silenceNotificationsUntil && !pastSilenceUntil
                  ? 'secondary'
                  : 'default'
              }
              onClick={() =>
                schedule.silenceNotificationsUntil && !pastSilenceUntil
                  ? onUnSilenceNotifications(schedule.id)
                  : onSilenceNotifications(schedule.id, schedule.name)
              }
            >
              {schedule.silenceNotificationsUntil && !pastSilenceUntil ? (
                <NotificationsOffIcon />
              ) : (
                <NotificationsActiveIcon />
              )}
            </IconButton>
          </Tooltip>
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
  const [unSilenceNotificationsDialog, setUnSilenceNotificationsDialog] =
    useReducer(
      (state: DialogState, setState: DialogState) => ({
        ...state,
        ...setState,
      }),
      { open: false, scheduleId: '' },
    );

  const [silenceNotificationsDialog, setSilenceNotificationsDialog] =
    useReducer(
      (
        state: DialogState & { scheduleName: string },
        setState: DialogState & { scheduleName: string },
      ) => ({
        ...state,
        ...setState,
      }),
      { open: false, scheduleId: '', scheduleName: '' },
    );

  const [deleteDialog, setDeleteDialog] = useReducer(
    (state: DialogState, setState: DialogState) => ({
      ...state,
      ...setState,
    }),
    { open: false, scheduleId: '' },
  );

  if (schedules.length === 0) {
    return <div>No schedules found</div>;
  }

  const handleUnSilenceNotificationsDialog = (id: string) => {
    setUnSilenceNotificationsDialog({
      open: true,
      scheduleId: id,
    });
  };

  const handleOpenSilenceNotificationsDialog = (id: string, name: string) => {
    setSilenceNotificationsDialog({
      open: true,
      scheduleId: id,
      scheduleName: name,
    });
  };

  const handleOpenDeleteDialog = (id: string) => {
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
                onDelete={handleOpenDeleteDialog}
                onSilenceNotifications={handleOpenSilenceNotificationsDialog}
                onUnSilenceNotifications={handleUnSilenceNotificationsDialog}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <UnSilenceNotificationsDialog
        open={unSilenceNotificationsDialog.open}
        scheduleId={unSilenceNotificationsDialog.scheduleId}
        scheduleName={
          schedules.find(
            (s) => s.id === unSilenceNotificationsDialog.scheduleId,
          )?.name ?? ''
        }
        onClose={() =>
          setUnSilenceNotificationsDialog({ open: false, scheduleId: '' })
        }
      />
      <SilenceNotificationsDialog
        open={silenceNotificationsDialog.open}
        scheduleId={silenceNotificationsDialog.scheduleId}
        scheduleName={
          schedules.find((s) => s.id === silenceNotificationsDialog.scheduleId)
            ?.name ?? ''
        }
        onClose={() =>
          setSilenceNotificationsDialog({
            open: false,
            scheduleId: '',
            scheduleName: '',
          })
        }
      />
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
          {(schedules) => (
            <Box>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Link to="/schedule/new">
                  <Button endIcon={<AddIcon />}>Add Schedule</Button>
                </Link>
              </Box>
              <ScheduleList schedules={schedules} />
            </Box>
          )}
        </Await>
      </Suspense>
    </Box>
  );
}
