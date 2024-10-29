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
        defaultProps: {
          sx: {
            borderRadius: 2,
            boxShadow: 4,
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
