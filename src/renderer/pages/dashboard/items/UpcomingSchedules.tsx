import { useMemo, useRef } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
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
          onClick: () => navigate('/schedule'),
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
        <List>
          {upcomingSchedules.map(({ schedule, nextRun, willNotify }) => (
            <ListItem key={schedule.id}>
              {willNotify ? (
                <Tooltip title="This notification will be sent">
                  <NotificationsActiveIcon sx={{ mr: 2 }} />
                </Tooltip>
              ) : (
                <Tooltip title="This notification will not be sent">
                  <NotificationsOffIcon sx={{ mr: 2 }} color="secondary" />
                </Tooltip>
              )}
              <ListItemText
                primary={
                  schedule.name.length > 40
                    ? `${schedule.name.slice(0, 37)}...`
                    : schedule.name
                }
                secondary={nextRun.toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
      }
    />
  );
}
