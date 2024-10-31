import { Notification } from 'electron';
import { getState } from '../../state';

export default (notification: Notification, ignoreSilence = false) => {
  const { silenceNotifications } = getState();
  console.log('silenceNotifications', silenceNotifications);
  console.log('ignoreSilence', ignoreSilence);
  if (silenceNotifications && !ignoreSilence) {
    return;
  }
  notification.show();
};
