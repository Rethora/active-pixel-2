import {
  createTheme,
  useTheme,
  ThemeProvider as MUIThemeProvider,
  Theme,
} from '@mui/material';
import { ReactNode } from 'react';

type ThemeProviderProps = {
  children: ReactNode;
};

const getTheme = (appProviderTheme: Theme) => {
  return createTheme({
    palette: {
      ...appProviderTheme.palette,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow:
              appProviderTheme.palette.mode === 'dark'
                ? 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
                : appProviderTheme.shadows[5],
          },
        },
      },
    },
  });
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const appProviderTheme = useTheme();

  return (
    <MUIThemeProvider theme={getTheme(appProviderTheme)}>
      {children}
    </MUIThemeProvider>
  );
}
