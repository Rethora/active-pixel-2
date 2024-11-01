import { Box, Button, Tooltip } from '@mui/material';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import { useRouteLoaderData } from 'react-router-typesafe';
import { PageContainer } from '@toolpad/core/PageContainer';
import { rootLoader } from '../../layouts/dashboard';
import UpcomingSchedules from './items/UpcomingSchedules';
import DashboardItem from './components/DashboardItem';
import AsyncResolver from '../../components/AsyncResolver';
import DoNotDisturb from './items/DoNotDisturb';

export default function DashboardPage() {
  const { settingsPromise, schedulesPromise } =
    useRouteLoaderData<typeof rootLoader>('root');

  return (
    <PageContainer title="Dashboard">
      <Box display="flex" flexDirection="column" gap={4}>
        <Box>
          <Box
            display="flex"
            gap={2}
            flexWrap="wrap"
            justifyContent="space-between"
          >
            <AsyncResolver
              promises={{
                settings: settingsPromise,
              }}
              fallback={<DashboardItem size="sm" loading />}
              errorElement={<DashboardItem size="sm" error />}
            >
              {(resolved) => <DoNotDisturb settings={resolved.settings} />}
            </AsyncResolver>
            <AsyncResolver
              promises={{
                settings: settingsPromise,
                schedules: schedulesPromise,
              }}
              fallback={<DashboardItem size="sm" loading />}
              errorElement={<DashboardItem size="sm" error />}
            >
              {() => <DashboardItem size="sm" error />}
            </AsyncResolver>
            <AsyncResolver
              promises={{
                settings: settingsPromise,
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
            justifyContent="space-between"
          >
            <AsyncResolver
              promises={{
                settings: settingsPromise,
                schedules: schedulesPromise,
              }}
              fallback={<DashboardItem size="md" loading />}
              errorElement={<DashboardItem size="md" error />}
            >
              {(resolved) => (
                <UpcomingSchedules
                  settings={resolved.settings}
                  schedules={resolved.schedules}
                  upNextRange={resolved.settings.upNextRange}
                  maxItems={resolved.settings.maxUpNextItems}
                />
              )}
            </AsyncResolver>
            <AsyncResolver
              promises={{
                settings: settingsPromise,
              }}
            >
              {() => <DashboardItem size="md" error />}
            </AsyncResolver>
            <AsyncResolver
              promises={{
                settings: settingsPromise,
              }}
            >
              {() => <DashboardItem size="md" loading />}
            </AsyncResolver>
          </Box>
          <Box
            display="flex"
            gap={2}
            flexWrap="wrap"
            justifyContent="space-between"
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
            <AsyncResolver
              promises={{
                settings: settingsPromise,
              }}
              errorElement={<DashboardItem size="lg" error />}
              fallback={<DashboardItem size="lg" loading />}
            >
              {() => <DashboardItem size="lg" error />}
            </AsyncResolver>
            <AsyncResolver
              promises={{
                settings: settingsPromise,
              }}
            >
              {() => <DashboardItem size="lg" loading />}
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
