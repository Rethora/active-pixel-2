import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { AppProvider as MUIAppProvider } from '@toolpad/core/react-router-dom';
import { type Navigation, type Branding } from '@toolpad/core';
import { ReactNode } from 'react';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'schedule',
    title: 'Schedule',
    icon: <ScheduleIcon />,
  },
  {
    segment: 'settings',
    title: 'Settings',
    icon: <SettingsIcon />,
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
