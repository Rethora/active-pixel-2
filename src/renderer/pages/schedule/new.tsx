import { Box, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ScheduleForm from './form';

export default function NewSchedulePage() {
  const navigate = useNavigate();
  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">New Schedule</Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <ScheduleForm method="POST" />
      </Box>
    </Box>
  );
}
