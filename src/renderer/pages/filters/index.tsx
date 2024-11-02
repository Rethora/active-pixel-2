import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { SuggestionFilters } from '../../../shared/types/suggestion';
import FilterSelector from '../../components/FilterSelector';
import { getRandomSuggestionWithFilters } from '../../../shared/suggestion';

export default function FiltersPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SuggestionFilters>({});

  const handleGetSuggestion = () => {
    const suggestion = getRandomSuggestionWithFilters({ filters });
    navigate('/suggestion/get', { state: { suggestion, filters } });
  };

  return (
    <Box p={4}>
      <FilterSelector filters={filters} onFiltersChange={setFilters} />
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button variant="contained" onClick={handleGetSuggestion}>
          Get Suggestion
        </Button>
      </Box>
    </Box>
  );
}
