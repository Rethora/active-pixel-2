import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CasinoIcon from '@mui/icons-material/Casino';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { getRandomSuggestionWithFilters } from '../../../../shared/suggestion';
import DashboardItem from '../components/DashboardItem';

export default function QuickSuggestion() {
  const navigate = useNavigate();

  const handleQuickSuggestion = () => {
    const suggestion = getRandomSuggestionWithFilters();
    navigate('/suggestion', { state: { suggestion, filters: {} } });
  };

  const handleFilteredSuggestion = () => {
    navigate('/suggestion/quick');
  };

  return (
    <DashboardItem
      size="sm"
      cardTitle="Quick Suggestion"
      cardSubheader="Get a random exercise suggestion"
      cardContent={
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
          height="100%"
        >
          <Button
            variant="contained"
            startIcon={<CasinoIcon />}
            onClick={handleQuickSuggestion}
          >
            Random
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterAltIcon />}
            onClick={handleFilteredSuggestion}
          >
            Filtered
          </Button>
        </Box>
      }
    />
  );
}