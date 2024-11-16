import { useMemo, useReducer, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
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
import { GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import TimerIcon from '@mui/icons-material/Timer';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import Loading from '../../components/Loading';
import { getHumanReadableTimeSchedule } from '../../../shared/util/time';
import {
  useDeleteScheduleMutation,
  useGetSchedulesQuery,
  useUpdateScheduleMutation,
} from '../../slices/schedulesSlice';
import DataGrid from '../../components/DataGrid';
import RescheduleModal from '../../components/RescheduleModal';

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
  const [updateSchedule] = useUpdateScheduleMutation();

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
          endIcon={<NotificationsActiveIcon />}
          onClick={() => {
            updateSchedule({
              id: scheduleId,
              updatedSchedule: {
                silenceNotificationsUntil: null,
              },
            });
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
  const [updateSchedule] = useUpdateScheduleMutation();
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
            updateSchedule({
              id: scheduleId,
              updatedSchedule: {
                silenceNotificationsUntil: date?.toISOString() ?? null,
              },
            });
            onClose();
          }}
          endIcon={<NotificationsOffIcon />}
        >
          Silence
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DeleteDialog({ open, scheduleId, onClose }: DialogProps) {
  const [deleteSchedule] = useDeleteScheduleMutation();

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

function RemoveRescheduleDialog({ open, scheduleId, onClose }: DialogProps) {
  const [updateSchedule] = useUpdateScheduleMutation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Remove Reschedule?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This will return the schedule to its original timing.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            updateSchedule({
              id: scheduleId,
              updatedSchedule: {
                rescheduled: null,
              },
            });
            onClose();
          }}
        >
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ScheduleList({
  heightSubtraction,
}: {
  heightSubtraction: number | undefined;
}) {
  const { data: schedules = [], isLoading: isSchedulesLoading } =
    useGetSchedulesQuery();
  const [updateSchedule] = useUpdateScheduleMutation();
  const [rescheduleDialog, setRescheduleDialog] = useState<DialogState>({
    open: false,
    scheduleId: '',
  });

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

  const [removeRescheduleDialog, setRemoveRescheduleDialog] = useReducer(
    (state: DialogState, setState: DialogState) => ({
      ...state,
      ...setState,
    }),
    { open: false, scheduleId: '' },
  );

  const handleUnSilenceNotificationsDialog = useCallback((id: string) => {
    setUnSilenceNotificationsDialog({
      open: true,
      scheduleId: id,
    });
  }, []);

  const handleOpenSilenceNotificationsDialog = useCallback(
    (id: string, name: string) => {
      setSilenceNotificationsDialog({
        open: true,
        scheduleId: id,
        scheduleName: name,
      });
    },
    [],
  );

  const handleOpenDeleteDialog = useCallback((id: string) => {
    setDeleteDialog({
      open: true,
      scheduleId: id,
    });
  }, []);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: 'Name', flex: 1 },
      {
        field: 'time',
        headerName: 'Schedule',
        flex: 1,
        valueGetter: (_, row) => getHumanReadableTimeSchedule(row.time),
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
        width: 200,
        sortable: false,
        renderCell: (params) => {
          const pastSilenceUntil = Boolean(
            params.row.silenceNotificationsUntil &&
              new Date() > new Date(params.row.silenceNotificationsUntil),
          );

          const isRescheduled = Boolean(
            params.row.rescheduled &&
              new Date(params.row.rescheduled.endTime) > new Date(),
          );

          return (
            <Box display="flex" justifyContent="center" alignItems="center">
              <Tooltip
                title={
                  params.row.silenceNotificationsUntil && !pastSilenceUntil
                    ? `Notifications silenced until ${new Date(
                        params.row.silenceNotificationsUntil,
                      ).toLocaleString()}`
                    : 'Silence this notification'
                }
              >
                <IconButton
                  color={
                    params.row.silenceNotificationsUntil && !pastSilenceUntil
                      ? 'secondary'
                      : 'default'
                  }
                  onClick={() =>
                    params.row.silenceNotificationsUntil && !pastSilenceUntil
                      ? handleUnSilenceNotificationsDialog(params.row.id)
                      : handleOpenSilenceNotificationsDialog(
                          params.row.id,
                          params.row.name,
                        )
                  }
                >
                  {params.row.silenceNotificationsUntil && !pastSilenceUntil ? (
                    <NotificationsOffIcon />
                  ) : (
                    <NotificationsActiveIcon />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  isRescheduled
                    ? `Rescheduled until ${new Date(params.row.rescheduled.endTime).toLocaleString()}`
                    : 'Reschedule'
                }
              >
                <IconButton
                  color={isRescheduled ? 'secondary' : 'default'}
                  onClick={() =>
                    isRescheduled
                      ? setRemoveRescheduleDialog({
                          open: true,
                          scheduleId: params.row.id,
                        })
                      : setRescheduleDialog({
                          open: true,
                          scheduleId: params.row.id,
                        })
                  }
                >
                  {isRescheduled ? <TimerOffIcon /> : <TimerIcon />}
                </IconButton>
              </Tooltip>
              <Link to={`/schedules/edit/${params.row.id}`}>
                <Tooltip title="Edit">
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Link>
              <Tooltip title="Delete">
                <IconButton
                  onClick={() => handleOpenDeleteDialog(params.row.id)}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
    ],
    [
      updateSchedule,
      handleOpenDeleteDialog,
      handleOpenSilenceNotificationsDialog,
      handleUnSilenceNotificationsDialog,
    ],
  );

  if (isSchedulesLoading) {
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
          loading: isSchedulesLoading,
          disableRowSelectionOnClick: true,
        }}
        heightSubtraction={heightSubtraction}
      />

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
      <RemoveRescheduleDialog
        open={removeRescheduleDialog.open}
        scheduleId={removeRescheduleDialog.scheduleId}
        onClose={() =>
          setRemoveRescheduleDialog({ open: false, scheduleId: '' })
        }
      />
      {rescheduleDialog.scheduleId && (
        <RescheduleModal
          open={rescheduleDialog.open}
          onClose={() => setRescheduleDialog({ open: false, scheduleId: '' })}
          schedule={
            schedules.find((s) => s.id === rescheduleDialog.scheduleId)!
          }
          onSubmit={async (reschedule) => {
            await updateSchedule({
              id: rescheduleDialog.scheduleId,
              updatedSchedule: { rescheduled: reschedule },
            });
          }}
        />
      )}
    </Box>
  );
}

export default function SchedulePage() {
  const actionsContainerRef = useRef<HTMLDivElement>(null);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="flex-end"
        ref={actionsContainerRef}
        mb={2}
      >
        <Link to="/schedules/new">
          <Button variant="outlined" endIcon={<AddIcon />}>
            Add Schedule
          </Button>
        </Link>
      </Box>
      <Box display="flex" justifyContent="center">
        <ScheduleList
          heightSubtraction={
            (actionsContainerRef.current?.clientHeight ?? 0) + 16 // 16px is the margin bottom of the actions container
          }
        />
      </Box>
    </Box>
  );
}
