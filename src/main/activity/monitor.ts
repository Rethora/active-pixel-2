import { powerMonitor } from 'electron';
import showUnproductiveNotification from '../notifications/notifcationTypes/unproductive';
import storePromise from '../store';
import { Settings } from '../../shared/types/settings';

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

const handleUnproductivePeriod = () => {
  showUnproductiveNotification();
  resetActiveTime();
};

const checkUserProductivity = async () => {
  const store = await storePromise;
  const settings = (await store.get('settings')) as Settings;
  const activePercentage =
    (activeTime / (settings.productivityCheckInterval / 1000)) * 100;

  const idleTime = powerMonitor.getSystemIdleTime();
  if (activePercentage <= settings.productivityThresholdPercentage) {
    if (idleTime >= IDLE_THRESHOLD) {
      handleUnproductivePeriod();
    } else {
      setTimeout(checkUserProductivity, NOTIFICATION_DELAY_MS);
    }
  } else {
    resetActiveTime();
  }
};

export const startActivityMonitor = async () => {
  const store = await storePromise;
  const settings = (await store.get('settings')) as Settings;
  if (!settings.displayUnproductiveNotifications) {
    return;
  }
  shortCheckInterval = setInterval(trackActivity, CHECK_INTERVAL_MS); // Check every second
  longCheckInterval = setInterval(
    checkUserProductivity,
    settings.productivityCheckInterval,
  );
};

export const stopActivityMonitor = () => {
  clearInterval(shortCheckInterval);
  clearInterval(longCheckInterval);
  activeTime = 0;
};

export const handleActivityMonitor = () => {
  stopActivityMonitor();
  startActivityMonitor();
};
