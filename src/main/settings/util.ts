import handleAutoLaunch from '../util/launcher';
import { Settings } from '../../shared/types/settings';
import { handleActivityMonitor } from '../activity/monitor';
import { setState } from '../state';

const handleSettings = (settings: Settings) => {
  const { showWindowOnStartup, runInBackground, runOnStartup } = settings;
  setState({
    showWindowOnStartup,
    runInBackground,
  });
  handleAutoLaunch(runOnStartup);
  handleActivityMonitor();
};

export default handleSettings;
