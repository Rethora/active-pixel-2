import { useState } from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
  const [numberOfResults, setNumberOfResults] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestion = () => {
    setError(null);
    const suggestion = getRandomSuggestion({
      suggestionsWithAddProps: suggestions,
      filters,
    });
    if (!suggestion) {
      setError('No suggestions found with the current filters');
      return;
    }
    navigate(`/suggestions/${suggestion.id}`);
  };

  return (
    <Box>
      <FilterSelector
        filters={filters}
        onFiltersChange={(newFilters) =>
          dispatch(setCurrentFilters(newFilters))
        }
        onNumberOfResultsChange={setNumberOfResults}
      />
      <Box display="flex" justifyContent="flex-end">
        <Tooltip title={error ?? ''}>
          <span>
            <Button
              onClick={handleSuggestion}
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              disabled={!!error || numberOfResults === 0}
            >
              Get Suggestion
            </Button>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
}
