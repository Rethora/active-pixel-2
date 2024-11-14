import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import FlakyIcon from '@mui/icons-material/Flaky';
import TimelineIcon from '@mui/icons-material/Timeline';
import { AppProvider as MUIAppProvider } from '@toolpad/core/react-router-dom';
import { type Navigation, type Branding } from '@toolpad/core';
import { ReactNode } from 'react';
import roundedLogo from '../../../assets/icons/rounded1024x1024.png';

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
    segment: 'progress',
    title: 'Daily Progress',
    icon: <AutoModeIcon />,
  },
  {
    segment: 'schedules',
    title: 'Schedules',
    icon: <ScheduleIcon />,
    pattern: 'schedules{/:segment}*',
  },
  {
    segment: 'do-not-disturb',
    title: 'Do Not Disturb',
    icon: <DoNotDisturbOnIcon />,
    pattern: 'do-not-disturb{/:segment}*',
  },
  {
    segment: 'suggestions',
    title: 'Suggestions',
    icon: <FlakyIcon />,
    pattern: 'suggestions{/:segment}*',
  },
  {
    segment: 'productivity',
    title: 'Productivity',
    icon: <TimelineIcon />,
    pattern: 'productivity{/:segment}*',
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
  logo: <img src={roundedLogo} alt="logo" />,
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
