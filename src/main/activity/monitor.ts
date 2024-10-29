import { powerMonitor } from 'electron';
import storeHelpersPromise from '../settings/storeHelpers';
import showUnproductiveNotification from '../notifications/unproductive';

const IDLE_THRESHOLD = 1; // seconds
const CHECK_INTERVAL_MS = 1000; // 1 second
// const PRODUCTIVITY_CHECK_INTERVAL_MIN = 1; // 5 minutes
// const PRODUCTIVITY_CHECK_INTERVAL_MS =
// PRODUCTIVITY_CHECK_INTERVAL_MIN * 60 * 1000; // 5 minutes
// const PRODUCTIVITY_THRESHOLD_PERCENTAGE = 70; // 70%
const NOTIFICATION_DELAY_MS = 5000; // 5 seconds

let activeTime = 0;
// eslint-disable-next-line no-undef
let shortCheckInterval: NodeJS.Timeout;
// eslint-disable-next-line no-undef
let longCheckInterval: NodeJS.Timeout;

const resetActiveTime = () => {
  activeTime = 0;
};

const trackActivity = () => {
  const state = powerMonitor.getSystemIdleState(3); // ? Testing this rn (gives the user 3 seconds of leeway)
  if (state === 'active') {
    activeTime += 1;
  }
};

const handleUnproductivePeriod = (activePercentage: number) => {
  console.log(
    'Unproductive period detected! Active percentage:',
    activePercentage,
  );
  showUnproductiveNotification();
  resetActiveTime();
};

const checkUserProductivity = async () => {
  const { getSettings } = await storeHelpersPromise;
  const settings = await getSettings();
  const activePercentage =
    (activeTime / (settings.productivityCheckInterval / 1000)) * 100;

  const idleTime = powerMonitor.getSystemIdleTime();
  console.log('End of period, active percentage:', activePercentage);
  if (activePercentage <= settings.productivityThresholdPercentage) {
    if (idleTime >= IDLE_THRESHOLD) {
      handleUnproductivePeriod(activePercentage);
    } else {
      console.log('User is busy, delaying notification...');
      setTimeout(checkUserProductivity, NOTIFICATION_DELAY_MS);
    }
  } else {
    resetActiveTime();
  }
};

export const startActivityMonitor = async () => {
  const { getSettings } = await storeHelpersPromise;
  const settings = await getSettings();
  if (!settings.displayUnproductiveNotifications) {
    console.log('Unproductive notifications are disabled, not starting logger');
    return;
  }
  console.log('Starting activity logger...');
  shortCheckInterval = setInterval(trackActivity, CHECK_INTERVAL_MS); // Check every second
  longCheckInterval = setInterval(
    checkUserProductivity,
    settings.productivityCheckInterval,
  );
};

export const stopActivityMonitor = () => {
  console.log('Stopping activity logger...');
  clearInterval(shortCheckInterval);
  clearInterval(longCheckInterval);
  activeTime = 0;
};

export const handleActivityMonitor = () => {
  console.log('Restarting activity logger...');
  stopActivityMonitor();
  startActivityMonitor();
};
