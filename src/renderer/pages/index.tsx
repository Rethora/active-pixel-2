import { Box, Button } from '@mui/material';

export default function DashboardPage() {
  return (
    <Box>
      <Button onClick={() => window.electron.ipcRenderer.quitApp()}>
        Quit App
      </Button>
    </Box>
  );
}
