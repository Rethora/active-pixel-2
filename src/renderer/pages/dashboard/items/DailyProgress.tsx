import { useMemo } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DashboardItem from '../components/DashboardItem';
import { useGetDailyProgressQuery } from '../../../slices/progressSlice';

export default function DailyProgressView() {
  const { data: dailyProgress } = useGetDailyProgressQuery(undefined, {
    pollingInterval: 60000,
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

  return (
    <DashboardItem
      size="sm"
      cardTitle="Daily Progress"
      cardSubheader={`${completedCount}/${totalCount} completed`}
      speedDialActions={[
        {
          name: 'View all',
          icon: <ListAltIcon />,
          onClick: () => navigate('/progress'),
        },
      ]}
      cardContent={
        <Box display="flex" flexDirection="column">
          <Typography variant="h6" align="right">
            {`${Math.floor(percentage)}%`}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={percentage}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
      }
    />
  );
}
