import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppProvider from './providers/AppProvider';
import ThemeProvider from './providers/ThemeProvider';
import SnackbarProvider from './providers/SnackbarProvider';
import LocalizationProvider from './providers/LocalizationProvider';
import StoreProvider from './providers/StoreProvider';
import { useAppDispatch } from './store/hooks';
import { setCurrentFilters } from './slices/suggestionsSlice';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
        dispatch(setCurrentFilters(filters));
        return navigate(`/suggestions/${suggestion.id}`);
      },
    );
  }, [navigate, dispatch]);

  return <Outlet />;
}

// Main App component that sets up providers
export default function App() {
  return (
    <StoreProvider>
      <AppProvider>
        <ThemeProvider>
          <LocalizationProvider>
            <SnackbarProvider />
            <AppContent />
          </LocalizationProvider>
        </ThemeProvider>
      </AppProvider>
    </StoreProvider>
  );
}
