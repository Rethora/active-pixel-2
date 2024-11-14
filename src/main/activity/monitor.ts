import { powerMonitor } from 'electron';
import showUnproductiveNotification from '../notifications/notificationTypes/unproductive';
import store from '../store';
import { ProductivityPeriod } from '../../shared/types/monitor';
import STORE from '../../shared/constants/store';
import { isWithinExcludedTimeFrame } from '../../shared/util/time';

const IDLE_THRESHOLD = 3; // seconds
const CHECK_INTERVAL_MS = 1000; // 1 second
const NOTIFICATION_DELAY_MS = IDLE_THRESHOLD * 1000;
const NOTIFICATION_PAUSE_DURATION = 5 * 60 * 1000; // 5 minute pause after notifications

let activeTime = 0;
let isActivityPaused = false;
let pauseStartTime: number | null = null;
let totalPausedTime = 0;

// eslint-disable-next-line no-undef
let shortCheckInterval: NodeJS.Timeout;
// eslint-disable-next-line no-undef
let longCheckTimeout: NodeJS.Timeout;
// eslint-disable-next-line no-undef
let unproductiveTimeout: NodeJS.Timeout | null = null;
let currentPeriodStartTime = new Date().toISOString();
let currentPeriodStartMs = Date.now();

const resetActiveTime = () => {
  activeTime = 0;
  totalPausedTime = 0;
  pauseStartTime = null;
  isActivityPaused = false;
  currentPeriodStartMs = Date.now();
  currentPeriodStartTime = new Date().toISOString();
  if (unproductiveTimeout) {
    clearTimeout(unproductiveTimeout);
    unproductiveTimeout = null;
  }
};

const pauseActivityTracking = () => {
  if (!isActivityPaused) {
    isActivityPaused = true;
    pauseStartTime = Date.now();
  }
};

const resumeActivityTracking = () => {
  if (isActivityPaused && pauseStartTime) {
    totalPausedTime += Date.now() - pauseStartTime;
    isActivityPaused = false;
    pauseStartTime = null;
  }
};

const trackActivity = () => {
  if (isActivityPaused) return;

  const state = powerMonitor.getSystemIdleState(3);
  if (state === 'active') {
    activeTime += 1;
  }
};

const calculateActivePercentage = (elapsed: number, active: number): number => {
  if (elapsed === 0) return 0;

  // Calculate actual elapsed time excluding paused time
  const actualElapsed = elapsed - Math.floor(totalPausedTime / 1000);
  if (actualElapsed <= 0) return 0;

  return Math.floor(Math.min((active / actualElapsed) * 100, 100));
};

// Function to pause activity for a specific duration
export const pauseActivityForDuration = (durationMs: number) => {
  pauseActivityTracking();

  // Clear existing timeout
  if (longCheckTimeout) {
    clearTimeout(longCheckTimeout);
  }

  // Schedule resume and next check
  setTimeout(() => {
    resumeActivityTracking();
    const settings = store.get('settings');
    longCheckTimeout = setTimeout(
      // eslint-disable-next-line no-use-before-define
      checkUserProductivity,
      settings.productivityCheckInterval,
    );
  }, durationMs);
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

const saveProductivityPeriod = (activePercentage: number) => {
  const settings = store.get('settings');
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
};

const checkUserProductivity = () => {
  const settings = store.get('settings');
  const elapsedSeconds = Math.floor((Date.now() - currentPeriodStartMs) / 1000);
  const activePercentage = calculateActivePercentage(
    elapsedSeconds,
    activeTime,
  );

  checkDailyReset();

  const scheduleUnproductiveCheck = () => {
    if (unproductiveTimeout) {
      clearTimeout(unproductiveTimeout);
    }
    unproductiveTimeout = setTimeout(
      checkUserProductivity,
      NOTIFICATION_DELAY_MS,
    );
  };

  // Save productivity period regardless of threshold
  const doNotDisturbSchedules = store.get('doNotDisturbSchedules');
  if (
    !settings.doNotDisturb &&
    !doNotDisturbSchedules.some(isWithinExcludedTimeFrame)
  ) {
    saveProductivityPeriod(activePercentage);
  }

  // Check for unproductive period
  if (activePercentage <= settings.productivityThresholdPercentage) {
    const idleTime = powerMonitor.getSystemIdleTime();
    if (idleTime >= IDLE_THRESHOLD) {
      handleUnproductivePeriod();
      pauseActivityForDuration(NOTIFICATION_PAUSE_DURATION);
      resetActiveTime();
      return;
    }
    scheduleUnproductiveCheck();
    return;
  }

  // If we're above threshold, reset and schedule next check
  resetActiveTime();
  longCheckTimeout = setTimeout(
    checkUserProductivity,
    settings.productivityCheckInterval,
  );
};

export const startActivityMonitor = () => {
  const settings = store.get('settings');
  if (!settings.displayUnproductiveNotifications) {
    return;
  }
  checkDailyReset();
  shortCheckInterval = setInterval(trackActivity, CHECK_INTERVAL_MS);
  longCheckTimeout = setTimeout(
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
  clearTimeout(longCheckTimeout);
  if (unproductiveTimeout) {
    clearTimeout(unproductiveTimeout);
    unproductiveTimeout = null;
  }
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

// Add new export for suggestion notifications
export const handleNotificationPause = () => {
  pauseActivityForDuration(NOTIFICATION_PAUSE_DURATION);
};
