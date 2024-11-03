import { useMemo, useRef } from 'react';
import { Box, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DashboardItem from '../components/DashboardItem';
import { DailyProgress } from '../../../../shared/types/schedule';
import useMinuteTimer from '../../../hooks/useMinuteTimer';

type Props = {
  dailyProgress: DailyProgress;
};

export default function DailyProgressView({ dailyProgress }: Props) {
  const navigate = useNavigate();
  const nowRef = useRef(new Date());

  useMinuteTimer(() => {
    nowRef.current = new Date();
  });

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
          onClick: () => navigate('/schedule/progress'),
        },
      ]}
      cardContent={
        <Box>
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
