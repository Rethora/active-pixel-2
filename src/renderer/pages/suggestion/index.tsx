import { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import SuggestionsTable from './components/SuggestionsTable';

export default function SuggestionsPage() {
  const [likedSuggestions, setLikedSuggestions] = useState<string[]>([]);
  const [dislikedSuggestions, setDislikedSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const loadPreferences = async () => {
      const [liked, disliked] = await Promise.all([
        window.electron.store.getLikedSuggestions(),
        window.electron.store.getDislikedSuggestions(),
      ]);
      setLikedSuggestions(liked);
      setDislikedSuggestions(disliked);
    };
    loadPreferences();
  }, []);

  const handleFeedback = useCallback(
    async (id: string, feedback: 'liked' | 'disliked' | 'none') => {
      if (feedback === 'liked') {
        await window.electron.store.addLikedSuggestion(id);
      } else if (feedback === 'disliked') {
        await window.electron.store.addDislikedSuggestion(id);
      } else {
        await window.electron.store.removeLikedSuggestion(id);
        await window.electron.store.removeDislikedSuggestion(id);
      }
      setLikedSuggestions(await window.electron.store.getLikedSuggestions());
      setDislikedSuggestions(
        await window.electron.store.getDislikedSuggestions(),
      );
    },
    [],
  );

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
      <SuggestionsTable
        likedSuggestions={likedSuggestions}
        dislikedSuggestions={dislikedSuggestions}
        handleFeedback={handleFeedback}
      />
    </Box>
  );
}
