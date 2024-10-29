import { Box, Button } from '@mui/material';
import { useEffect } from 'react';

export default function DashboardPage() {
  useEffect(() => {
    window.electron.ipcRenderer.onSuggestionNotification(
      (suggestion, filters) => console.log(suggestion, filters),
    );
  }, []);
  return (
    <Box>
      <Button onClick={() => window.electron.ipcRenderer.quitApp()}>
        Quit App
      </Button>
    </Box>
  );
}
