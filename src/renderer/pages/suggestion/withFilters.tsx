import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FilterSelector from '../../components/FilterSelector';
import { getRandomSuggestion } from '../../../shared/util/suggestion';
import {
  setCurrentFilters,
  useGetAllSuggestionsWithAddPropsQuery,
} from '../../slices/suggestionsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export default function SuggestionWithFiltersPage() {
  const { data: suggestions = [] } = useGetAllSuggestionsWithAddPropsQuery();
  const navigate = useNavigate();
  const filters = useAppSelector((state) => state.suggestions.currentFilters);
  const dispatch = useAppDispatch();

  const handleSuggestion = () => {
    const suggestion = getRandomSuggestion({
      suggestionsWithAddProps: suggestions,
      filters,
    });
    if (!suggestion) return;
    navigate(`/suggestion/${suggestion.id}`);
  };

  return (
    <Box>
      <FilterSelector
        filters={filters}
        onFiltersChange={(newFilters) =>
          dispatch(setCurrentFilters(newFilters))
        }
      />
      <Box display="flex" justifyContent="flex-end">
        <Button onClick={handleSuggestion}>Get Suggestion</Button>
      </Box>
    </Box>
  );
}
