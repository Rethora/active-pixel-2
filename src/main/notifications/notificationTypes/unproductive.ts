import { Notification } from 'electron';
import showHiddenWindow from '../../util/window';
import {
  getRandomSuggestion,
  getSuggestionsWithAddProps,
} from '../../../shared/util/suggestion';
import {
  Category,
  Level,
  SuggestionFilters,
} from '../../../shared/types/suggestion';
import { getState } from '../../state';
import handleNotification from '../handleNotification';
import store from '../../store';

const showUnproductiveNotification = () => {
  const notification = new Notification({
    title: 'Ready for a short break?',
    body: 'A quick stretch can help you stay productive!',
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

export default showUnproductiveNotification;
