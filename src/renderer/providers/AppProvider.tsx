import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ListIcon from '@mui/icons-material/List';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
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
    segment: 'schedule',
    title: 'Scheduling',
    icon: <ScheduleIcon />,
    pattern: 'schedule/edit/:id',
    children: [
      {
        segment: '/',
        title: 'Schedules',
        icon: <ListIcon />,
      },
      {
        segment: 'new',
        title: 'New Schedule',
        icon: <AddIcon />,
      },
    ],
  },
  {
    segment: 'suggestion/quick',
    title: 'Quick Suggestion',
    icon: <RocketLaunchIcon />,
  },
  {
    segment: 'settings',
    title: 'Settings',
    icon: <SettingsIcon />,
    children: [
      {
        segment: '/',
        title: 'Settings',
        icon: <SettingsIcon />,
      },
      {
        segment: 'edit',
        title: 'Edit Settings',
        icon: <EditIcon />,
      },
    ],
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
