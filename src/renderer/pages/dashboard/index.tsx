import { Box, Button, Tooltip } from '@mui/material';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import { PageContainer } from '@toolpad/core/PageContainer';
import UpcomingSchedules from './items/UpcomingSchedules';
import DoNotDisturb from './items/DoNotDisturb';
import QuickSuggestion from './items/QuickSuggestion';
import DailyProgress from './items/DailyProgress';
import DailyProgressList from './items/DailyProgressList';
import { useGetSettingsQuery } from '../../slices/settingsSlice';

export default function DashboardPage() {
  const { data: settings } = useGetSettingsQuery();

  return (
    <PageContainer title="Dashboard">
      <Box display="flex" flexDirection="column" gap={4}>
        <Box>
          <Box
            display="flex"
            gap={2}
            flexWrap="wrap"
            sx={{
              '& > *': { flex: '1 1 300px' },
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}
          >
            <DoNotDisturb />
            <QuickSuggestion />
            <DailyProgress />
          </Box>
        </Box>
        <Box>
          <Box
            display="flex"
            gap={2}
            flexWrap="wrap-reverse"
            sx={{
              '& > *': { flex: '1 1 600px' },
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}
          >
            <UpcomingSchedules />
            <DailyProgressList />
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Tooltip
            title={
              !settings?.runInBackground
                ? 'Quit app'
                : 'Quit app and prevent from running in background'
            }
          >
            <Button
              color="error"
              endIcon={<PowerOffIcon />}
              variant="contained"
            >
              Quit App
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </PageContainer>
  );
}
