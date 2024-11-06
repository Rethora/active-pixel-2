import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Tooltip,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Button,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import cronParser from 'cron-parser';
import dayjs from 'dayjs';
import { Schedule } from '../../../../shared/types/schedule';
import { Settings } from '../../../../shared/types/settings';
import DashboardItem from '../components/DashboardItem';
import { useGetSettingsQuery } from '../../../slices/settingsSlice';
import { useGetSchedulesQuery } from '../../../slices/schedulesSlice';
import { useGetDoNotDisturbSchedulesQuery } from '../../../slices/doNotDisturbSchedulesSlice';
import { DayOfWeek } from '../../../../shared/types/doNotDisturbSchedules';

type UpcomingSchedule = {
  schedule: Schedule;
  nextRun: Date;
  willNotify: boolean;
  silenceReason: string | null;
};

function Row({
  schedule,
  nextRun,
  willNotify,
  silenceReason,
}: UpcomingSchedule) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        sx={{ '& > *': { borderBottom: 'unset' }, cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
      >
        <TableCell padding="checkbox">
          <Box display="flex" alignItems="center">
            {willNotify ? (
              <Tooltip
                title={`You will be notified at ${nextRun.toLocaleString()}`}
              >
                <NotificationsActiveIcon />
              </Tooltip>
            ) : (
              <Tooltip title="This notification will not be sent">
                <NotificationsOffIcon color="secondary" />
              </Tooltip>
            )}
          </Box>
        </TableCell>
        <TableCell component="th" scope="row">
          {schedule.name}
        </TableCell>
        <TableCell padding="checkbox">
          <IconButton aria-label="expand row" size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="subtitle2" gutterBottom component="div">
                Schedule Details
              </Typography>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Next Notification At
                    </TableCell>
                    <TableCell>{nextRun.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Will be notified
                    </TableCell>
                    <TableCell>{willNotify ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                  {!willNotify && (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Silence Reason
                      </TableCell>
                      <TableCell>{silenceReason}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function UpcomingSchedules() {
  const { data: schedules = [], isLoading: isSchedulesLoading } =
    useGetSchedulesQuery(undefined, {
      pollingInterval: 60000,
    });
  const { data: settings = {} as Settings, isLoading: isSettingsLoading } =
    useGetSettingsQuery(undefined, {
      pollingInterval: 60000,
    });
  const { data: doNotDisturbSchedules = [] } = useGetDoNotDisturbSchedulesQuery(
    undefined,
    {
      pollingInterval: 60000,
    },
  );
  const navigate = useNavigate();

  const { upcomingSchedules, totalUpcoming } = useMemo(() => {
    const now = new Date();
    const cutoffTime = new Date(
      now.getTime() + settings.upNextRange * 60 * 60 * 1000,
    );

    const totalSchedules = schedules
      .filter((schedule) => schedule.enabled)
      .map((schedule) => {
        try {
          const interval = cronParser.parseExpression(schedule.time);
          const nextRun = interval.next().toDate();

          let willNotify = true;
          let silenceReason: string | null = null;

          // Check schedule-specific silence
          if (
            schedule.silenceNotificationsUntil &&
            new Date(schedule.silenceNotificationsUntil) > nextRun
          ) {
            willNotify = false;
            silenceReason = 'Schedule notifications are silenced';
          }

          // Check global Do Not Disturb
          if (
            settings.doNotDisturb &&
            (!settings.turnOffDoNotDisturbAt ||
              dayjs(settings.turnOffDoNotDisturbAt).isAfter(nextRun))
          ) {
            willNotify = false;
            silenceReason = 'Do Not Disturb is enabled';
          }

          // Check Do Not Disturb schedules
          const isInDoNotDisturbSchedule = doNotDisturbSchedules.some(
            (dndSchedule) => {
              if (!dndSchedule.enabled) return false;

              const currentDay: DayOfWeek = [
                'SUN',
                'MON',
                'TUE',
                'WED',
                'THU',
                'FRI',
                'SAT',
              ][nextRun.getDay()] as DayOfWeek;

              if (!dndSchedule.days.includes(currentDay)) return false;

              const notificationMinutes =
                nextRun.getHours() * 60 + nextRun.getMinutes();

              return dndSchedule.times.some(({ startTime, endTime }) => {
                const [startHours, startMinutes] = startTime
                  .split(':')
                  .map(Number);
                const [endHours, endMinutes] = endTime.split(':').map(Number);

                const startTotalMinutes = startHours * 60 + startMinutes;
                const endTotalMinutes = endHours * 60 + endMinutes;

                return (
                  notificationMinutes >= startTotalMinutes &&
                  notificationMinutes <= endTotalMinutes
                );
              });
            },
          );

          if (isInDoNotDisturbSchedule) {
            willNotify = false;
            silenceReason = 'Within Do Not Disturb schedule';
          }

          return { schedule, nextRun, willNotify, silenceReason };
        } catch {
          return null;
        }
      })
      .filter(
        (
          item,
        ): item is {
          schedule: Schedule;
          nextRun: Date;
          willNotify: boolean;
          silenceReason: string | null;
        } => item !== null && item.nextRun > now && item.nextRun <= cutoffTime,
      )
      .sort((a, b) => {
        if (!a || !b) return 0;
        return a.nextRun.getTime() - b.nextRun.getTime();
      });

    const filteredSchedules = totalSchedules.slice(0, settings.maxUpNextItems);

    return {
      upcomingSchedules: filteredSchedules,
      totalUpcoming: totalSchedules.length,
    };
  }, [
    schedules,
    settings.upNextRange,
    settings.maxUpNextItems,
    settings.doNotDisturb,
    settings.turnOffDoNotDisturbAt,
    doNotDisturbSchedules,
  ]);

  if (isSchedulesLoading || isSettingsLoading) {
    return <DashboardItem size="md" loading />;
  }

  return (
    <DashboardItem
      size="md"
      cardTitle="Upcoming Schedules"
      speedDialActions={[
        {
          name: 'View all',
          icon: <ListAltIcon />,
          onClick: () => navigate('/schedules'),
        },
        {
          name: 'Edit these display settings',
          icon: <SettingsIcon />,
          onClick: () =>
            navigate('/settings', {
              preventScrollReset: true,
              state: {
                scrollTo: 'dashboard-settings',
              },
            }),
        },
      ]}
      cardSubheader={`${totalUpcoming} total upcoming in the next ${settings.upNextRange} hours`}
      cardContent={
        upcomingSchedules.length === 0 ? (
          <Box display="flex" flexDirection="column" height="100%">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Typography>No Upcoming Schedules For Now</Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              height="100%"
              justifyContent="flex-end"
              gap={2}
            >
              <Button
                variant="outlined"
                onClick={() => navigate('/schedules/new')}
                endIcon={<AddIcon />}
              >
                New Schedule
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/schedules')}
                endIcon={<ListAltIcon />}
              >
                All schedules
              </Button>
            </Box>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: '100%' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">Status</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell padding="checkbox" />
                </TableRow>
              </TableHead>
              <TableBody>
                {upcomingSchedules.map((schedule) => (
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  <Row key={schedule.schedule.id} {...schedule} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      }
    />
  );
}
