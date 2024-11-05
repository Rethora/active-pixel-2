import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ListIcon from '@mui/icons-material/List';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import FlakyIcon from '@mui/icons-material/Flaky';
import { AppProvider as MUIAppProvider } from '@toolpad/core/react-router-dom';
import { type Navigation, type Branding } from '@toolpad/core';
import { ReactNode } from 'react';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },

  {
    segment: 'schedules',
    title: 'Schedules',
    icon: <ScheduleIcon />,
    pattern: 'schedules{/:segment}*',
  },
  {
    segment: 'progress',
    title: 'Daily Progress',
    icon: <AutoModeIcon />,
  },
  {
    segment: 'suggestions',
    title: 'Suggestions',
    icon: <FlakyIcon />,
    pattern: 'suggestions{/:segment}*',
  },
  {
    segment: 'settings',
    title: 'Settings',
    icon: <SettingsIcon />,
    pattern: 'settings{/:segment}*',
  },
];

const BRANDING: Branding = {
  title: 'Active Pixel',
  // TODO: Add logo
};

type AppProviderProps = {
  children: ReactNode;
};

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <MUIAppProvider navigation={NAVIGATION} branding={BRANDING}>
      {children}
    </MUIAppProvider>
  );
}
