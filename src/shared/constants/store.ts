const UPDATE_BETA_RELEASES = {
  DEFAULT: false,
};

const DISPLAY_UNPRODUCTIVE_NOTIFICATIONS = {
  DEFAULT: false,
};

const PRODUCTIVITY_THRESHOLD_PERCENTAGE = {
  MINIMUM: 0,
  MAXIMUM: 100,
  DEFAULT: 70,
};

const RUN_IN_BACKGROUND = {
  DEFAULT: false,
};

const RUN_ON_STARTUP = {
  DEFAULT: false,
};

const SHOW_WINDOW_ON_STARTUP = {
  DEFAULT: false,
};

const PRODUCTIVITY_CHECK_INTERVAL = {
  MINIMUM: process.env.NODE_ENV === 'development' ? 60000 : 300000,
  MAXIMUM: 10800000,
  DEFAULT: 600000,
};

const UP_NEXT_RANGE = {
  MINIMUM: 1,
  MAXIMUM: 168,
  DEFAULT: 24,
};

const MAX_UP_NEXT_ITEMS = {
  MINIMUM: 1,
  MAXIMUM: 20,
  DEFAULT: 10,
};

const DO_NOT_DISTURB = {
  DEFAULT: false,
};

const TURN_OFF_DO_NOT_DISTURB_AT = {
  DEFAULT: null,
};

const PRODUCTIVITY_HISTORY_LENGTH = {
  MINIMUM: 1,
  MAXIMUM: 25,
  DEFAULT: 10,
};

const STORE = {
  UPDATE_BETA_RELEASES,
  DISPLAY_UNPRODUCTIVE_NOTIFICATIONS,
  PRODUCTIVITY_THRESHOLD_PERCENTAGE,
  RUN_IN_BACKGROUND,
  RUN_ON_STARTUP,
  SHOW_WINDOW_ON_STARTUP,
  PRODUCTIVITY_CHECK_INTERVAL,
  UP_NEXT_RANGE,
  MAX_UP_NEXT_ITEMS,
  DO_NOT_DISTURB,
  TURN_OFF_DO_NOT_DISTURB_AT,
  PRODUCTIVITY_HISTORY_LENGTH,
};

export default STORE;
