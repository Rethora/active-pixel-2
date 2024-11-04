import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CasinoIcon from '@mui/icons-material/Casino';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { getRandomSuggestion } from '../../../../shared/util/suggestion';
import DashboardItem from '../components/DashboardItem';
import { useGetAllSuggestionsWithAddPropsQuery } from '../../../slices/suggestionsSlice';

export default function QuickSuggestion() {
  const { data: suggestions = [] } = useGetAllSuggestionsWithAddPropsQuery();
  const navigate = useNavigate();

  const handleQuickSuggestion = () => {
    const suggestion = getRandomSuggestion({
      suggestionsWithAddProps: suggestions,
    });
    navigate('/suggestion/get', { state: { suggestion, filters: {} } });
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
        <Box display="flex" justifyContent="space-evenly">
          <Button
            variant="contained"
            startIcon={<CasinoIcon />}
            onClick={handleQuickSuggestion}
            size="small"
          >
            Random
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterAltIcon />}
            onClick={handleFilteredSuggestion}
            size="small"
          >
            Filtered
          </Button>
        </Box>
      }
    />
  );
}
