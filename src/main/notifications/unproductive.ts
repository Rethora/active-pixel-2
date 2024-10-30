import { Notification } from 'electron';
import showHiddenWindow from '../util/window';
import { getRandomSuggestionWithFilters } from '../../shared/suggestion';
import {
  Category,
  Level,
  SuggestionFilters,
} from '../../shared/types/suggestion';
import { getState } from '../state';

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

      const randomStretch = getRandomSuggestionWithFilters(filters);
      mainWindow.webContents.send(
        'suggestion-notification',
        randomStretch,
        filters,
      );
    }
  });

  notification.show();
};

export default showUnproductiveNotification;
