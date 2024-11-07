import { powerMonitor } from 'electron';
import showUnproductiveNotification from '../notifications/notificationTypes/unproductive';
import store from '../store';
import { ProductivityPeriod } from '../../shared/types/monitor';
import STORE from '../../shared/constants/store';

const IDLE_THRESHOLD = 1; // seconds
const CHECK_INTERVAL_MS = 1000; // 1 second
const NOTIFICATION_DELAY_MS = 5000; // 5 seconds

let activeTime = 0;
// eslint-disable-next-line no-undef
let shortCheckInterval: NodeJS.Timeout;
// eslint-disable-next-line no-undef
let longCheckInterval: NodeJS.Timeout;
let currentPeriodStartTime = new Date().toISOString();
let currentPeriodStartMs = Date.now();
let isCheckingProductivity = false;

const resetActiveTime = () => {
  activeTime = 0;
  currentPeriodStartMs = Date.now();
};

const trackActivity = () => {
  const state = powerMonitor.getSystemIdleState(3);
  if (state === 'active') {
    activeTime += 1;
  }
};

const handleUnproductivePeriod = () => {
  showUnproductiveNotification();
};

const checkDailyReset = () => {
  const today = new Date().toISOString().split('T')[0];
  const productivityHistory = store.get('productivityHistory');

  if (productivityHistory.lastResetDate !== today) {
    store.set('productivityHistory', {
      periods: [],
      lastResetDate: today,
    });
  }
};

const calculateActivePercentage = (elapsed: number, active: number): number => {
  if (elapsed === 0) return 0;
  return Math.floor(Math.min((active / elapsed) * 100, 100));
};

const checkUserProductivity = () => {
  if (isCheckingProductivity) return;
  isCheckingProductivity = true;

  try {
    const settings = store.get('settings');
    const elapsedSeconds = Math.floor(
      (Date.now() - currentPeriodStartMs) / 1000,
    );
    const activePercentage = calculateActivePercentage(
      elapsedSeconds,
      activeTime,
    );

    // Only save to history at the end of a check interval
    if (elapsedSeconds >= settings.productivityCheckInterval / 1000) {
      checkDailyReset();

      const now = new Date().toISOString();
      const productivityHistory = store.get('productivityHistory');

      const newPeriod: ProductivityPeriod = {
        startTime: currentPeriodStartTime,
        endTime: now,
        activePercentage,
      };

      const maxHistoryLength = Math.min(
        Math.max(
          settings.productivityHistoryLength ||
            STORE.PRODUCTIVITY_HISTORY_LENGTH.DEFAULT,
          STORE.PRODUCTIVITY_HISTORY_LENGTH.MINIMUM,
        ),
        STORE.PRODUCTIVITY_HISTORY_LENGTH.MAXIMUM,
      );

      const updatedPeriods = [...productivityHistory.periods, newPeriod].slice(
        -maxHistoryLength,
      );

      store.set('productivityHistory.periods', updatedPeriods);

      // Reset for next period
      currentPeriodStartTime = now;
      currentPeriodStartMs = Date.now();
      activeTime = 0;
    }

    // Check if we need to show notification
    if (activePercentage <= settings.productivityThresholdPercentage) {
      const idleTime = powerMonitor.getSystemIdleTime();
      if (idleTime >= IDLE_THRESHOLD) {
        handleUnproductivePeriod();
        resetActiveTime();
      } else {
        setTimeout(checkUserProductivity, NOTIFICATION_DELAY_MS);
      }
    }
  } finally {
    isCheckingProductivity = false;
  }
};

export const startActivityMonitor = () => {
  const settings = store.get('settings');
  if (!settings.displayUnproductiveNotifications) {
    return;
  }
  checkDailyReset();
  shortCheckInterval = setInterval(trackActivity, CHECK_INTERVAL_MS);
  longCheckInterval = setInterval(
    checkUserProductivity,
    settings.productivityCheckInterval,
  );
};

export const resetProductivityHistory = () => {
  store.set('productivityHistory', {
    periods: [],
    lastResetDate: new Date().toISOString().split('T')[0],
  });
  currentPeriodStartTime = new Date().toISOString();
  currentPeriodStartMs = Date.now();
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

export const getCurrentProductivity = (): ProductivityPeriod => {
  const elapsedSeconds = Math.floor((Date.now() - currentPeriodStartMs) / 1000);
  const activePercentage = calculateActivePercentage(
    elapsedSeconds,
    activeTime,
  );

  return {
    activePercentage,
    startTime: currentPeriodStartTime,
    endTime: new Date().toISOString(),
  };
};

export const getProductivityHistory = () => {
  checkDailyReset();
  return store.get('productivityHistory').periods;
};
