import { useMemo, useRef, useState } from 'react';
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
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import cronParser from 'cron-parser';
import dayjs from 'dayjs';
import { Schedule } from '../../../../shared/types/schedule';
import { Settings } from '../../../../shared/types/settings';
import DashboardItem from '../components/DashboardItem';
import useMinuteTimer from '../../../hooks/useMinuteTimer';
import { useGetSettingsQuery } from '../../../slices/settingsSlice';
import { useGetSchedulesQuery } from '../../../slices/schedulesSlice';

type UpcomingSchedule = {
  schedule: Schedule;
  nextRun: Date;
  willNotify: boolean;
};

function Row({ schedule, nextRun, willNotify }: UpcomingSchedule) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
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
                      Notifications Silenced Until
                    </TableCell>
                    <TableCell>
                      {schedule.silenceNotificationsUntil
                        ? new Date(
                            schedule.silenceNotificationsUntil,
                          ).toLocaleString()
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
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
    useGetSchedulesQuery();
  const { data: settings = {} as Settings, isLoading: isSettingsLoading } =
    useGetSettingsQuery();
  const navigate = useNavigate();
  const nowRef = useRef(new Date());

  useMinuteTimer(() => {
    nowRef.current = new Date();
  });

  const { upcomingSchedules, totalUpcoming } = useMemo(() => {
    const cutoffTime = new Date(
      nowRef.current.getTime() + settings.upNextRange * 60 * 60 * 1000,
    );

    const filtered = schedules
      .filter((schedule) => schedule.enabled)
      .map((schedule) => {
        try {
          const interval = cronParser.parseExpression(schedule.time);
          const nextRun = interval.next().toDate();

          // Check if notifications will be active at nextRun time
          const willNotify =
            !schedule.silenceNotificationsUntil ||
            new Date(schedule.silenceNotificationsUntil) < nextRun;

          // Check Do Not Disturb settings
          if (
            settings.doNotDisturb &&
            (!settings.turnOffDoNotDisturbAt ||
              dayjs(settings.turnOffDoNotDisturbAt).isAfter(nextRun))
          ) {
            return { schedule, nextRun, willNotify: false };
          }

          return { schedule, nextRun, willNotify };
        } catch {
          return null;
        }
      })
      .filter(
        (item): item is UpcomingSchedule =>
          item !== null &&
          item.nextRun > nowRef.current &&
          item.nextRun <= cutoffTime,
      )
      .sort((a, b) => a.nextRun.getTime() - b.nextRun.getTime())
      .slice(0, settings.maxUpNextItems);

    return {
      upcomingSchedules: filtered,
      totalUpcoming: schedules.length,
    };
  }, [
    schedules,
    settings.upNextRange,
    settings.maxUpNextItems,
    settings.doNotDisturb,
    settings.turnOffDoNotDisturbAt,
  ]);

  if (isSchedulesLoading || isSettingsLoading) {
    return <DashboardItem size="md" loading />;
  }

  if (upcomingSchedules.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No upcoming notifications scheduled
      </Typography>
    );
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
        <TableContainer>
          <Table size="small">
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
      }
    />
  );
}
