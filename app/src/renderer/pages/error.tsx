import { Box, Button, Typography } from '@mui/material';

export default function ErrorPage() {
  return (
    <Box>
      <Typography variant="h4" color="error" align="center" gutterBottom>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        We encountered an unexpected error while processing your request.
      </Typography>
      <Typography variant="body2" align="center" paragraph>
        Please try refreshing the page or come back later.
      </Typography>
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
      </Box>
    </Box>
  );
}
