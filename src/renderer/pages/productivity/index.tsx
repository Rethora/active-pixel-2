import { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  useGetCurrentProductivityQuery,
  useGetProductivityHistoryQuery,
} from '../../slices/productivitySlice';
import { useGetSettingsQuery } from '../../slices/settingsSlice';
import Loading from '../../components/Loading';
import { ProductivityPeriod } from '../../../shared/types/monitor';

export default function ProductivityPage() {
  const { data: settings, isLoading: isSettingsLoading } =
    useGetSettingsQuery();
  const { data: productivityHistory = [], isLoading: isHistoryLoading } =
    useGetProductivityHistoryQuery(undefined, {
      pollingInterval: 60000,
    });
  const {
    data: currentProductivity = {} as ProductivityPeriod,
    isLoading: isCurrentProductivityLoading,
  } = useGetCurrentProductivityQuery(undefined, {
    pollingInterval: 10000,
  });

  const formattedHistory = useMemo(() => {
    return [...productivityHistory].reverse().map((period) => ({
      ...period,
      startTime: dayjs(period.startTime),
      endTime: dayjs(period.endTime),
      duration: dayjs(period.endTime).diff(dayjs(period.startTime), 'minutes'),
      activePercentage: Math.round(period.activePercentage),
    }));
  }, [productivityHistory]);

  const averageProductivity = useMemo(() => {
    if (!formattedHistory.length) return 0;
    const sum = formattedHistory.reduce(
      (acc, period) => acc + period.activePercentage,
      0,
    );
    return Math.round(sum / formattedHistory.length);
  }, [formattedHistory]);

  if (isSettingsLoading || isHistoryLoading || isCurrentProductivityLoading) {
    return <Loading />;
  }

  if (!settings?.displayUnproductiveNotifications) {
    return (
      <Box display="flex" flexDirection="column" gap={4} alignItems="center">
        <Box display="flex" justifyContent="center" alignItems="center" p={4}>
          <Typography variant="h6" color="textSecondary">
            Productivity tracking is currently disabled. Enable it in settings
            to view your activity history.
          </Typography>
        </Box>
        <Box mt={2}>
          <Button
            variant="contained"
            component={Link}
            to="/settings"
            state={{ scrollTo: 'notifications-settings' }}
            endIcon={<ArrowForwardIos />}
          >
            Go to Settings
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current Productivity
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <LinearProgress
            variant="determinate"
            value={currentProductivity.activePercentage}
            sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
          />
          <Typography variant="body1" sx={{ minWidth: 50 }}>
            {currentProductivity.activePercentage}%
          </Typography>
        </Box>
      </Paper>
      {/* Summary Section */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Average Productivity
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <LinearProgress
            variant="determinate"
            value={averageProductivity}
            sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
          />
          <Typography variant="body1" sx={{ minWidth: 50 }}>
            {averageProductivity}%
          </Typography>
        </Box>
      </Paper>

      {/* History Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell align="right">Activity Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formattedHistory.map((period) => (
              <TableRow
                key={period.startTime.toISOString()}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  backgroundColor:
                    period.activePercentage <
                    settings.productivityThresholdPercentage
                      ? 'error.main'
                      : undefined,
                  opacity:
                    period.activePercentage <
                    settings.productivityThresholdPercentage
                      ? 0.7
                      : 1,
                }}
              >
                <TableCell>{period.startTime.format('h:mm A')}</TableCell>
                <TableCell>{period.endTime.format('h:mm A')}</TableCell>
                <TableCell>{period.duration} mins</TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="center" gap={1}>
                    <LinearProgress
                      variant="determinate"
                      value={period.activePercentage}
                      sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography sx={{ minWidth: 40 }}>
                      {period.activePercentage}%
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
