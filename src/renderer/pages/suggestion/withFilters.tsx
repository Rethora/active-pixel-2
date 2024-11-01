import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { SuggestionFilters } from '../../../shared/types/suggestion';
import FilterSelector from '../../components/FilterSelector';
import { getRandomSuggestionWithFilters } from '../../../shared/suggestion';

export default function SuggestionWithFiltersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState<SuggestionFilters>(
    location.state?.filters || {},
  );

  useEffect(() => {
    setFilters(location.state?.filters || {});
  }, [location.state]);

  const handleSuggestion = () => {
    const suggestion = getRandomSuggestionWithFilters(filters);
    navigate('/suggestion', { state: { suggestion, filters, from: 'quick' } });
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
