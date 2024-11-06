import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useRef } from 'react';
import DoNotDisturbList from './components/DoNotDisturbList';

export default function DoNotDisturbPage() {
  const actionsContainerRef = useRef<HTMLDivElement>(null);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="flex-end"
        ref={actionsContainerRef}
        mb={2}
      >
        <Link to="/do-not-disturb/new">
          <Button endIcon={<AddIcon />}>Add Schedule</Button>
        </Link>
      </Box>
      <Box display="flex" justifyContent="center">
        <DoNotDisturbList
          heightSubtraction={
            (actionsContainerRef.current?.clientHeight ?? 0) + 16 // 16px is the margin bottom of the actions container
          }
        />
      </Box>
    </Box>
  );
}
