import { Box, Button, Tooltip } from '@mui/material';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import { useRouteLoaderData } from 'react-router-typesafe';
import { PageContainer } from '@toolpad/core/PageContainer';
import { rootLoader } from '../../layouts/dashboard';
import UpcomingSchedules from './items/UpcomingSchedules';
import DashboardItem from './components/DashboardItem';
import AsyncResolver from '../../components/AsyncResolver';
import DoNotDisturb from './items/DoNotDisturb';
import QuickSuggestion from './items/QuickSuggestion';

export default function DashboardPage() {
  const { schedulesPromise } = useRouteLoaderData<typeof rootLoader>('root');

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
            <AsyncResolver
              promises={{
                schedules: schedulesPromise,
              }}
              fallback={<DashboardItem size="sm" loading />}
              errorElement={<DashboardItem size="sm" error />}
            >
              {() => <DashboardItem size="sm" error />}
            </AsyncResolver>
            <AsyncResolver
              promises={{
                schedules: schedulesPromise,
              }}
              fallback={<DashboardItem size="sm" loading />}
              errorElement={<DashboardItem size="sm" error />}
            >
              {() => <DashboardItem size="sm" loading />}
            </AsyncResolver>
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
            <AsyncResolver
              promises={{
                schedules: schedulesPromise,
              }}
              fallback={<DashboardItem size="md" loading />}
              errorElement={<DashboardItem size="md" error />}
            >
              {(resolved) => (
                <UpcomingSchedules schedules={resolved.schedules} />
              )}
            </AsyncResolver>
          </Box>
          <Box
            display="flex"
            gap={2}
            flexWrap="wrap"
            sx={{
              '& > *': { flex: '1 1 800px' },
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}
          >
            <AsyncResolver
              promises={{}}
              fallback={<DashboardItem size="lg" loading />}
              errorElement={<DashboardItem size="lg" error />}
            >
              {() => (
                <DashboardItem
                  size="lg"
                  cardTitle="Placeholder Title"
                  cardSubheader="Placeholder Subheader"
                  cardContent={<div>Placeholder Content</div>}
                />
              )}
            </AsyncResolver>
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
