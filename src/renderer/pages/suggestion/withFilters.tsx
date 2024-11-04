import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { SuggestionFilters } from '../../../shared/types/suggestion';
import FilterSelector from '../../components/FilterSelector';
import { getRandomSuggestion } from '../../../shared/util/suggestion';
import { useGetAllSuggestionsWithAddPropsQuery } from '../../slices/suggestionsSlice';

export default function SuggestionWithFiltersPage() {
  const { data: suggestions = [] } = useGetAllSuggestionsWithAddPropsQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState<SuggestionFilters>(
    location.state?.filters || {},
  );

  useEffect(() => {
    setFilters(location.state?.filters || {});
  }, [location.state]);

  const handleSuggestion = () => {
    const suggestion = getRandomSuggestion({
      suggestionsWithAddProps: suggestions,
      filters,
    });
    navigate('/suggestion/get', {
      state: { suggestion, filters, from: 'quick' },
    });
  };

  return (
    <Box>
      <FilterSelector filters={filters} onFiltersChange={setFilters} />
      <Box display="flex" justifyContent="flex-end">
        <Button onClick={handleSuggestion}>Get Suggestion</Button>
      </Box>
    </Box>
  );
}
