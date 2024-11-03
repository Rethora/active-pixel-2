import { Notification } from 'electron';
import { getState } from '../../state';
import { Schedule } from '../../../shared/types/schedule';
import { getRandomSuggestionWithFilters } from '../../../shared/suggestion';
import handleNotification from '../handleNotification';

const showSuggestionNotification = (schedule: Schedule) => {
  const suggestion = getRandomSuggestionWithFilters({
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
