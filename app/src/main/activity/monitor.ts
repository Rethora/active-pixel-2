import { powerMonitor } from 'electron';
import showUnproductiveNotification from '../notifications/notificationTypes/unproductive';
import showWorkForTooLongNotification from '../notifications/notificationTypes/workForTooLong';
import store from '../store';
import { ProductivityPeriod } from '../../shared/types/monitor';
import STORE from '../../shared/constants/store';
import { isWithinExcludedTimeFrame } from '../../shared/util/time';

// Shared timing constants
const IDLE_THRESHOLD = 3; // seconds
const CHECK_INTERVAL_MS = 1000; // 1 second
const NOTIFICATION_DELAY_MS = IDLE_THRESHOLD * 1000;
const NOTIFICATION_PAUSE_DURATION =
  60 * 1000 * (process.env.NODE_ENV === 'development' ? 1 : 5);

// Productivity tracking state
let productivityActiveTime = 0;
let productivityIsActivityPaused = false;
let productivityPauseStartTime: number | null = null;
let productivityTotalPausedTime = 0;
let productivityPeriodStartTime = new Date().toISOString();
let productivityPeriodStartMs = Date.now();

// Too long activity tracking state
let tooLongActiveTime = 0;
let tooLongIsActivityPaused = false;
let tooLongPauseStartTime: number | null = null;
let tooLongTotalPausedTime = 0;
let tooLongPeriodStartTime = new Date().toISOString();
let tooLongPeriodStartMs = Date.now();

// Timeouts
// eslint-disable-next-line no-undef
let shortCheckInterval: NodeJS.Timeout;
// eslint-disable-next-line no-undef
let productivityCheckTimeout: NodeJS.Timeout;
// eslint-disable-next-line no-undef
let tooLongCheckTimeout: NodeJS.Timeout;
// eslint-disable-next-line no-undef
let unproductiveTimeout: NodeJS.Timeout | null = null;

// Split reset functions
const resetProductivityTime = () => {
  productivityActiveTime = 0;
  productivityTotalPausedTime = 0;
  productivityPauseStartTime = null;
  productivityIsActivityPaused = false;
  productivityPeriodStartMs = Date.now();
  productivityPeriodStartTime = new Date().toISOString();
  if (unproductiveTimeout) {
    clearTimeout(unproductiveTimeout);
    unproductiveTimeout = null;
  }
};

const resetTooLongTime = () => {
  tooLongActiveTime = 0;
  tooLongTotalPausedTime = 0;
  tooLongPauseStartTime = null;
  tooLongIsActivityPaused = false;
  tooLongPeriodStartMs = Date.now();
  tooLongPeriodStartTime = new Date().toISOString();
};

// Split pause functions
const pauseProductivityTracking = () => {
  if (!productivityIsActivityPaused) {
    productivityIsActivityPaused = true;
    productivityPauseStartTime = Date.now();
  }
};

const pauseTooLongTracking = () => {
  if (!tooLongIsActivityPaused) {
    tooLongIsActivityPaused = true;
    tooLongPauseStartTime = Date.now();
  }
};

// Split resume functions
const resumeProductivityTracking = () => {
  if (productivityIsActivityPaused && productivityPauseStartTime) {
    productivityTotalPausedTime += Date.now() - productivityPauseStartTime;
    productivityIsActivityPaused = false;
    productivityPauseStartTime = null;
    resetProductivityTime();
  }
};

const resumeTooLongTracking = () => {
  if (tooLongIsActivityPaused && tooLongPauseStartTime) {
    tooLongTotalPausedTime += Date.now() - tooLongPauseStartTime;
    tooLongIsActivityPaused = false;
    tooLongPauseStartTime = null;
    resetTooLongTime();
  }
};

// Modified track activity
const trackActivity = () => {
  const state = powerMonitor.getSystemIdleState(3);
  if (state === 'active') {
    if (!productivityIsActivityPaused) {
      productivityActiveTime += 1;
    }
    if (!tooLongIsActivityPaused) {
      tooLongActiveTime += 1;
    }
  }
};

// Split calculate functions
const calculateProductivityPercentage = (
  elapsed: number,
  active: number,
): number => {
  if (elapsed === 0) return 0;
  const actualElapsed =
    elapsed - Math.floor(productivityTotalPausedTime / 1000);
  if (actualElapsed <= 0) return 0;
  return Math.floor(Math.min((active / actualElapsed) * 100, 100));
};

const calculateTooLongPercentage = (
  elapsed: number,
  active: number,
): number => {
  if (elapsed === 0) return 0;
  const actualElapsed = elapsed - Math.floor(tooLongTotalPausedTime / 1000);
  if (actualElapsed <= 0) return 0;
  return Math.floor(Math.min((active / actualElapsed) * 100, 100));
};

// Modified pause duration function
export const pauseActivityForDuration = (durationMs: number) => {
  pauseProductivityTracking();
  pauseTooLongTracking();

  setTimeout(() => {
    resumeProductivityTracking();
    resumeTooLongTracking();
    // eslint-disable-next-line no-use-before-define
    startProductivityCheck();
    // eslint-disable-next-line no-use-before-define
    startTooLongCheck();
  }, durationMs);
};

const handleUnproductivePeriod = () => {
  const settings = store.get('settings');
  if (!settings.displayUnproductiveNotifications) {
    return;
  }
  showUnproductiveNotification();
};

const handleWorkForTooLong = () => {
  const settings = store.get('settings');
  if (!settings.displayWorkForTooLongNotification) {
    return;
  }
  showWorkForTooLongNotification();
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
    startTime: productivityPeriodStartTime,
    endTime: now,
    activePercentage,
    type: 'unproductive',
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

const saveTooLongPeriod = (activePercentage: number) => {
  const settings = store.get('settings');
  const now = new Date().toISOString();
  const productivityHistory = store.get('productivityHistory');

  const newPeriod: ProductivityPeriod = {
    startTime: tooLongPeriodStartTime,
    endTime: now,
    activePercentage,
    type: 'tooLong',
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

const startProductivityCheck = () => {
  const settings = store.get('settings');
  if (productivityCheckTimeout) {
    clearTimeout(productivityCheckTimeout);
  }
  productivityCheckTimeout = setTimeout(
    // eslint-disable-next-line no-use-before-define
    checkUserProductivity,
    settings.productivityCheckInterval,
  );
};

const startTooLongCheck = () => {
  const settings = store.get('settings');
  if (tooLongCheckTimeout) {
    clearTimeout(tooLongCheckTimeout);
  }
  tooLongCheckTimeout = setTimeout(
    // eslint-disable-next-line no-use-before-define
    checkTooLongActivity,
    settings.tooLongCheckInterval,
  );
};

const checkUserProductivity = () => {
  const settings = store.get('settings');
  if (!settings.displayUnproductiveNotifications) return;

  const elapsedSeconds = Math.floor(
    (Date.now() - productivityPeriodStartMs) / 1000,
  );
  const activePercentage = calculateProductivityPercentage(
    elapsedSeconds,
    productivityActiveTime,
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

  const doNotDisturbSchedules = store.get('doNotDisturbSchedules');
  const isDoNotDisturb =
    settings.doNotDisturb ||
    doNotDisturbSchedules.some(isWithinExcludedTimeFrame);

  // Check for unproductive period
  if (activePercentage <= settings.productivityThresholdPercentage) {
    const idleTime = powerMonitor.getSystemIdleTime();
    if (idleTime >= IDLE_THRESHOLD) {
      if (!isDoNotDisturb) {
        saveProductivityPeriod(activePercentage);
        handleUnproductivePeriod();
        pauseActivityForDuration(NOTIFICATION_PAUSE_DURATION);
      }
      return;
    }
    scheduleUnproductiveCheck();
    return;
  }

  // If we're above threshold, save period and reset
  if (!isDoNotDisturb) {
    saveProductivityPeriod(activePercentage);
  }
  resetProductivityTime();
  startProductivityCheck();
};

const checkTooLongActivity = () => {
  const settings = store.get('settings');
  if (!settings.displayWorkForTooLongNotification) return;

  const elapsedSeconds = Math.floor((Date.now() - tooLongPeriodStartMs) / 1000);
  const activePercentage = calculateTooLongPercentage(
    elapsedSeconds,
    tooLongActiveTime,
  );

  checkDailyReset();

  const scheduleTooLongCheck = () => {
    if (tooLongCheckTimeout) {
      clearTimeout(tooLongCheckTimeout);
    }
    tooLongCheckTimeout = setTimeout(
      checkTooLongActivity,
      NOTIFICATION_DELAY_MS,
    );
  };

  const doNotDisturbSchedules = store.get('doNotDisturbSchedules');
  const isDoNotDisturb =
    settings.doNotDisturb ||
    doNotDisturbSchedules.some(isWithinExcludedTimeFrame);

  // Check for too long period
  if (activePercentage >= settings.tooLongThresholdPercentage) {
    const idleTime = powerMonitor.getSystemIdleTime();
    if (idleTime >= IDLE_THRESHOLD) {
      if (!isDoNotDisturb) {
        saveTooLongPeriod(activePercentage);
        handleWorkForTooLong();
        pauseActivityForDuration(NOTIFICATION_PAUSE_DURATION);
      }
      return;
    }
    scheduleTooLongCheck();
    return;
  }

  // If we're below threshold, save period and reset
  if (!isDoNotDisturb) {
    saveTooLongPeriod(activePercentage);
  }
  resetTooLongTime();
  startTooLongCheck();
};

export const startActivityMonitor = () => {
  const settings = store.get('settings');
  if (
    !settings.displayUnproductiveNotifications &&
    !settings.displayWorkForTooLongNotification
  ) {
    return;
  }

  checkDailyReset();
  shortCheckInterval = setInterval(trackActivity, CHECK_INTERVAL_MS);

  if (settings.displayUnproductiveNotifications) {
    startProductivityCheck();
  }

  if (settings.displayWorkForTooLongNotification) {
    startTooLongCheck();
  }
};

export const resetProductivityHistory = () => {
  store.set('productivityHistory', {
    periods: [],
    lastResetDate: new Date().toISOString().split('T')[0],
  });
  productivityPeriodStartTime = new Date().toISOString();
  productivityPeriodStartMs = Date.now();
};

export const stopActivityMonitor = () => {
  clearInterval(shortCheckInterval);
  clearTimeout(productivityCheckTimeout);
  clearTimeout(tooLongCheckTimeout);
  if (unproductiveTimeout) {
    clearTimeout(unproductiveTimeout);
    unproductiveTimeout = null;
  }
  productivityActiveTime = 0;
  tooLongActiveTime = 0;
};

export const handleActivityMonitor = () => {
  stopActivityMonitor();
  startActivityMonitor();
};

export const getCurrentProductivity = (): ProductivityPeriod => {
  const elapsedSeconds = Math.floor(
    (Date.now() - productivityPeriodStartMs) / 1000,
  );
  const activePercentage = calculateProductivityPercentage(
    elapsedSeconds,
    productivityActiveTime,
  );

  return {
    activePercentage,
    startTime: productivityPeriodStartTime,
    endTime: new Date().toISOString(),
    type: 'unproductive',
  };
};

export const getCurrentTooLong = (): ProductivityPeriod => {
  const elapsedSeconds = Math.floor((Date.now() - tooLongPeriodStartMs) / 1000);
  const activePercentage = calculateTooLongPercentage(
    elapsedSeconds,
    tooLongActiveTime,
  );
  return {
    activePercentage,
    startTime: tooLongPeriodStartTime,
    endTime: new Date().toISOString(),
    type: 'tooLong',
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
