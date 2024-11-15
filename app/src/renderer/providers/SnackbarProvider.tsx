import { SnackbarProvider as DefaultSnackbarProvider } from 'notistack';

export default function SnackbarProvider() {
  return (
    <DefaultSnackbarProvider
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    />
  );
}
