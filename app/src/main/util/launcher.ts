import AutoLaunch from 'auto-launch';
import { app } from 'electron';

const autoLauncher = new AutoLaunch({
  name: 'Active Pixel',
  path: app.getPath('exe'),
});

const handleAutoLaunch = (enable: boolean) => {
  if (enable) {
    autoLauncher.enable();
  } else {
    autoLauncher.disable();
  }
};

export default handleAutoLaunch;
