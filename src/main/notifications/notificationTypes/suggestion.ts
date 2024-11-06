import { Notification } from 'electron';
import { getState } from '../../state';
import { Schedule } from '../../../shared/types/schedule';
import {
  getRandomSuggestion,
  getSuggestionsWithAddProps,
} from '../../../shared/util/suggestion';
import handleNotification from '../handleNotification';
import store from '../../store';
import showMainWindow from '../../util/window';

const showSuggestionNotification = (schedule: Schedule) => {
  const suggestionsWithAddProps = getSuggestionsWithAddProps({
    preferences: store.get('suggestionPreferences', {}),
  });
  const suggestion = getRandomSuggestion({
    suggestionsWithAddProps,
    filters: schedule.filters,
  });
  const notification = new Notification({
    title: `Time for ${schedule.name}`,
    body: suggestion
      ? `How about trying ${suggestion.name}?`
      : "We didn't find any suggestions for you.",
  });
  notification.on('click', () => {
    const { mainWindow } = getState();
    showMainWindow(mainWindow);
    if (mainWindow) {
      mainWindow.webContents.send(
        'suggestion-notification',
        suggestion,
        schedule.filters,
      );
    }
  });

  handleNotification(notification, { schedule, type: 'suggestion' });
};

export default showSuggestionNotification;
