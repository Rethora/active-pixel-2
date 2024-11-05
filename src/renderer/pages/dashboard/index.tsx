import { Box, Button, Tooltip } from '@mui/material';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import { PageContainer } from '@toolpad/core/PageContainer';
import UpcomingSchedules from './items/UpcomingSchedules';
import DoNotDisturb from './items/DoNotDisturb';
import QuickSuggestion from './items/QuickSuggestion';
import DailyProgress from './items/DailyProgress';

export default function DashboardPage() {
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
            flexWrap="wrap"
            sx={{
              '& > *': { flex: '1 1 400px' },
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}
          >
            <UpcomingSchedules />
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Tooltip title="Fully quit the app (prevent from running in background)">
            <Button color="error" endIcon={<PowerOffIcon />}>
              Quit App
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </PageContainer>
  );
}
