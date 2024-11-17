import { Notification } from 'electron';
import store from '../../store';
import { getState } from '../../state';
import showHiddenWindow from '../../util/window';
import handleNotification from '../handleNotification';
import {
  Category,
  Level,
  SuggestionFilters,
} from '../../../shared/types/suggestion';
import {
  getRandomSuggestion,
  getSuggestionsWithAddProps,
} from '../../../shared/util/suggestion';

export default () => {
  const settings = store.get('settings');
  if (!settings.displayWorkForTooLongNotification) {
    return;
  }

  const notification = new Notification({
    title: 'Take a break!',
    body: "It looks like you've been working for a while. Take a break to avoid burnout!",
  });
  notification.on('click', () => {
    const { mainWindow } = getState();
    if (mainWindow) {
      showHiddenWindow(mainWindow);

      const filters: SuggestionFilters = {
        category: [Category.Stretching],
        level: [Level.Beginner],
      };

      const suggestions = getSuggestionsWithAddProps({
        preferences: store.get('suggestionPreferences', {}),
      });
      const randomStretch = getRandomSuggestion({
        suggestionsWithAddProps: suggestions,
        filters,
      });
      mainWindow.webContents.send(
        'suggestion-notification',
        randomStretch,
        filters,
      );
    }
  });

  handleNotification(notification, { type: 'suggestion' });
};
