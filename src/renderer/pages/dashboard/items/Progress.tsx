import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Box, LinearProgress, Typography, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TimelineIcon from '@mui/icons-material/Timeline';
import DashboardItem from '../components/DashboardItem';
import { useGetDailyProgressQuery } from '../../../slices/progressSlice';
import { useGetCurrentProductivityQuery } from '../../../slices/productivitySlice';
import { useGetSettingsQuery } from '../../../slices/settingsSlice';

export default function ProgressView() {
  const { data: settings, isLoading: isSettingsLoading } =
    useGetSettingsQuery();
  const { data: dailyProgress, isLoading: isDailyProgressLoading } =
    useGetDailyProgressQuery(undefined, {
      pollingInterval: 60000,
    });
  const { data: currentProductivity, isLoading: isCurrentProductivityLoading } =
    useGetCurrentProductivityQuery(undefined, {
      pollingInterval: 10000,
    });
  const navigate = useNavigate();

  const { completedCount, totalCount, percentage } = useMemo(() => {
    if (!dailyProgress?.notifications.length) {
      return { completedCount: 0, totalCount: 0, percentage: 0 };
    }

    const completed = dailyProgress.notifications.filter(
      (n) => n.completed,
    ).length;
    const total = dailyProgress.notifications.length;
    return {
      completedCount: completed,
      totalCount: total,
      percentage: (completed / total) * 100,
    };
  }, [dailyProgress]);

  if (
    isSettingsLoading ||
    isDailyProgressLoading ||
    isCurrentProductivityLoading
  ) {
    return <DashboardItem size="sm" loading />;
  }

  return (
    <DashboardItem
      size="sm"
      cardTitle="Progress"
      cardSubheader="Overview of your productivity and task completion"
      speedDialActions={[
        {
          name: 'View tasks',
          icon: <ListAltIcon />,
          onClick: () => navigate('/progress'),
        },
      ].concat(
        settings?.displayUnproductiveNotifications
          ? [
              {
                name: 'View productivity',
                icon: <TimelineIcon />,
                onClick: () => navigate('/productivity'),
              },
            ]
          : [],
      )}
      cardContent={
        <Box
          height="100%"
          display="flex"
          flexDirection="column"
          justifyContent={
            settings?.displayUnproductiveNotifications
              ? 'space-between'
              : 'flex-end'
          }
          gap={2}
        >
          {/* Task Progress */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Task Completion (
              {`${completedCount}/${totalCount} tasks completed`})
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2">{Math.round(percentage)}%</Typography>
            </Box>
          </Box>
          {settings?.displayUnproductiveNotifications && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Active Percentage (
                  {dayjs(currentProductivity?.startTime).format('h:mm A')} -{' '}
                  {dayjs(currentProductivity?.endTime).format('h:mm A')})
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <LinearProgress
                    variant="determinate"
                    value={currentProductivity?.activePercentage ?? 0}
                    sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2">
                    {Math.round(currentProductivity?.activePercentage ?? 0)}%
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>
      }
    />
  );
}
