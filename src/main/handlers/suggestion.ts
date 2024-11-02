import { ipcMain } from 'electron';
import store from '../store';

export default () => {
  ipcMain.on('get-liked-suggestions', async (event) => {
    event.returnValue = (await store).get('likedSuggestions', []);
  });

  ipcMain.on('get-disliked-suggestions', async (event) => {
    event.returnValue = (await store).get('dislikedSuggestions', []);
  });

  ipcMain.on('add-liked-suggestion', async (event, id: string) => {
    const liked = (await store).get('likedSuggestions', []) as string[];
    const disliked = (await store).get('dislikedSuggestions', []) as string[];

    // Remove from disliked if present
    if (disliked.includes(id)) {
      (await store).set(
        'dislikedSuggestions',
        disliked.filter((x) => x !== id),
      );
    }

    // Add to liked if not already present
    if (!liked.includes(id)) {
      const newLiked = [...liked, id];
      (await store).set('likedSuggestions', newLiked);
      event.returnValue = newLiked;
    } else {
      event.returnValue = liked;
    }
  });

  ipcMain.on('remove-liked-suggestion', async (event, id: string) => {
    const liked = (await store).get('likedSuggestions', []) as string[];
    const newLiked = liked.filter((x) => x !== id);
    (await store).set('likedSuggestions', newLiked);
    event.returnValue = newLiked;
  });

  ipcMain.on('add-disliked-suggestion', async (event, id: string) => {
    const disliked = (await store).get('dislikedSuggestions', []) as string[];
    const liked = (await store).get('likedSuggestions', []) as string[];

    // Remove from liked if present
    if (liked.includes(id)) {
      (await store).set(
        'likedSuggestions',
        liked.filter((x) => x !== id),
      );
    }

    // Add to disliked if not already present
    if (!disliked.includes(id)) {
      const newDisliked = [...disliked, id];
      (await store).set('dislikedSuggestions', newDisliked);
      event.returnValue = newDisliked;
    } else {
      event.returnValue = disliked;
    }
  });

  ipcMain.on('remove-disliked-suggestion', async (event, id: string) => {
    const disliked = (await store).get('dislikedSuggestions', []) as string[];
    const newDisliked = disliked.filter((x) => x !== id);
    (await store).set('dislikedSuggestions', newDisliked);
    event.returnValue = newDisliked;
  });
};
