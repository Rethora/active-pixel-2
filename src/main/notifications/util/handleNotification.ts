import { Notification } from 'electron';
import { getState } from '../../state';

export default (notification: Notification, ignoreSilence = false) => {
  const { silenceNotifications } = getState();
  if (silenceNotifications && !ignoreSilence) {
    return;
  }
  notification.show();
};
