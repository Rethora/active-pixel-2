import Typography from '@mui/material/Typography';
import { useEffect } from 'react';

export default function DashboardPage() {
  useEffect(() => {
    const settings = window.electron.store.getSettings();
    console.log('settings', settings);
  }, []);
  return <Typography>Welcome to Toolpad!</Typography>;
}
