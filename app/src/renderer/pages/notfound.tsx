import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Box>
      <Typography variant="h4">Not Found!</Typography>
      <Link to="/">Go to the home page</Link>
    </Box>
  );
}
