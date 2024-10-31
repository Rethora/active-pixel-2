import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppProvider from './providers/AppProvider';
import ThemeProvider from './providers/ThemeProvider';
import SnackbarProvider from './providers/SnackbarProvider';
import LocalizationProvider from './providers/LocalizationProvider';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // * Root listener for suggestion notifications
    window.electron.ipcRenderer.onSuggestionNotification(
      (suggestion, filters) => {
        return navigate('/suggestion', { state: { suggestion, filters } });
      },
    );
  }, [navigate]);
  return (
    <AppProvider>
      <ThemeProvider>
        <LocalizationProvider>
          <SnackbarProvider />
          <Outlet />
        </LocalizationProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
