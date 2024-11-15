import handleAutoLaunch from '../util/launcher';
import { PartialSettings } from '../../shared/types/settings';
import { handleActivityMonitor } from '../activity/monitor';
import { setState } from '../state';

const handleSettings = (settings: PartialSettings) => {
  if (settings.showWindowOnStartup !== undefined) {
    setState({ showWindowOnStartup: settings.showWindowOnStartup });
  }
  if (settings.runInBackground !== undefined) {
    setState({ runInBackground: settings.runInBackground });
  }

  if (settings.runOnStartup !== undefined) {
    handleAutoLaunch(settings.runOnStartup);
  }
  if (settings.displayUnproductiveNotifications !== undefined) {
    handleActivityMonitor();
  }
};

export default handleSettings;
