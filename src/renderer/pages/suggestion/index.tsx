import { Box } from '@mui/material';
import SuggestionsTable from './components/SuggestionsTable';

export default function SuggestionsPage() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
      <SuggestionsTable />
    </Box>
  );
}
