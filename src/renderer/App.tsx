import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppProvider from './providers/AppProvider';
import ThemeProvider from './providers/ThemeProvider';
import SnackbarProvider from './providers/SnackbarProvider';
import LocalizationProvider from './providers/LocalizationProvider';
import StoreProvider from './providers/StoreProvider';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // * Redirect to dashboard if on root
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    // * Root listener for suggestion notifications
    window.electron.ipcRenderer.onSuggestionNotification(
      (suggestion, filters) => {
        return navigate('/suggestion/get', { state: { suggestion, filters } });
      },
    );
  }, [navigate]);

  return (
    <StoreProvider>
      <AppProvider>
        <ThemeProvider>
          <LocalizationProvider>
            <SnackbarProvider />
            <Outlet />
          </LocalizationProvider>
        </ThemeProvider>
      </AppProvider>
    </StoreProvider>
  );
}
