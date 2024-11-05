import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CasinoIcon from '@mui/icons-material/Casino';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { getRandomSuggestion } from '../../../../shared/util/suggestion';
import DashboardItem from '../components/DashboardItem';
import {
  setCurrentFilters,
  useGetAllSuggestionsWithAddPropsQuery,
} from '../../../slices/suggestionsSlice';
import { useAppDispatch } from '../../../store/hooks';

export default function QuickSuggestion() {
  const navigate = useNavigate();
  const { data: suggestions = [] } = useGetAllSuggestionsWithAddPropsQuery();
  const dispatch = useAppDispatch();

  const handleQuickSuggestion = () => {
    const suggestion = getRandomSuggestion({
      suggestionsWithAddProps: suggestions,
    });
    if (!suggestion) return;
    dispatch(setCurrentFilters({}));
    navigate(`/suggestions/${suggestion.id}`);
  };

  const handleFilteredSuggestion = () => {
    navigate('/suggestions/quick');
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
            endIcon={<CasinoIcon />}
            onClick={handleQuickSuggestion}
            size="small"
          >
            Random
          </Button>
          <Button
            variant="outlined"
            endIcon={<FilterAltIcon />}
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
