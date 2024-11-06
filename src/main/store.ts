// @ts-nocheck
import Store from 'electron-store';
import { DailyProgress, Schedule } from '../shared/types/schedule';
import { Settings } from '../shared/types/settings';
import {
  Category,
  Equipment,
  Force,
  Level,
  Mechanic,
  PrimaryMuscles,
  SecondaryMuscles,
  SuggestionPreferences,
} from '../shared/types/suggestion';
import { DoNotDisturbSchedule } from '../shared/types/doNotDisturbSchedules';
import STORE from '../shared/constants/store';

const schema = {
  settings: {
    type: 'object',
    default: {},
    properties: {
      displayUnproductiveNotifications: {
        type: 'boolean',
        default: STORE.DISPLAY_UNPRODUCTIVE_NOTIFICATIONS.DEFAULT,
      },
      productivityThresholdPercentage: {
        type: 'number',
        default: STORE.PRODUCTIVITY_THRESHOLD_PERCENTAGE.DEFAULT,
        minimum: STORE.PRODUCTIVITY_THRESHOLD_PERCENTAGE.MINIMUM,
        maximum: STORE.PRODUCTIVITY_THRESHOLD_PERCENTAGE.MAXIMUM,
      },
      productivityCheckInterval: {
        type: 'number',
        default: STORE.PRODUCTIVITY_CHECK_INTERVAL.DEFAULT,
        minimum: STORE.PRODUCTIVITY_CHECK_INTERVAL.MINIMUM,
        maximum: STORE.PRODUCTIVITY_CHECK_INTERVAL.MAXIMUM,
      },
      runInBackground: {
        type: 'boolean',
        default: STORE.RUN_IN_BACKGROUND.DEFAULT,
      },
      runOnStartup: {
        type: 'boolean',
        default: STORE.RUN_ON_STARTUP.DEFAULT,
      },
      showWindowOnStartup: {
        type: 'boolean',
        default: STORE.SHOW_WINDOW_ON_STARTUP.DEFAULT,
      },
      upNextRange: {
        type: 'number',
        default: STORE.UP_NEXT_RANGE.DEFAULT,
        minimum: STORE.UP_NEXT_RANGE.MINIMUM,
        maximum: STORE.UP_NEXT_RANGE.MAXIMUM,
      },
      maxUpNextItems: {
        type: 'number',
        default: STORE.MAX_UP_NEXT_ITEMS.DEFAULT,
        minimum: STORE.MAX_UP_NEXT_ITEMS.MINIMUM,
        maximum: STORE.MAX_UP_NEXT_ITEMS.MAXIMUM,
      },
      doNotDisturb: {
        type: 'boolean',
        default: STORE.DO_NOT_DISTURB.DEFAULT,
      },
      turnOffDoNotDisturbAt: {
        type: ['string', 'null'],
        default: STORE.TURN_OFF_DO_NOT_DISTURB_AT.DEFAULT,
      },
    },
  },
  schedules: {
    type: 'array',
    default: [],
    items: {
      type: 'object',
      properties: {
        silenceNotificationsUntil: { type: ['string', 'null'], default: null },
        id: { type: 'string' },
        name: { type: 'string' },
        time: { type: 'string' },
        enabled: { type: 'boolean' },
        filters: {
          type: 'object',
          properties: {
            force: {
              type: 'array',
              items: {
                type: 'string',
                enum: Object.values(Force),
              },
            },
            category: {
              type: 'array',
              items: {
                type: 'string',
                enum: Object.values(Category),
              },
            },
            level: {
              type: 'array',
              items: {
                type: 'string',
                enum: Object.values(Level),
              },
            },
            mechanic: {
              type: 'array',
              items: {
                type: 'string',
                enum: Object.values(Mechanic),
              },
            },
            equipment: {
              type: 'array',
              items: {
                type: 'string',
                enum: Object.values(Equipment),
              },
            },
            primaryMuscles: {
              type: 'array',
              items: {
                type: 'string',
                enum: Object.values(PrimaryMuscles),
              },
            },
            secondaryMuscles: {
              type: 'array',
              items: {
                type: 'string',
                enum: Object.values(SecondaryMuscles),
              },
            },
          },
        },
      },
    },
  },
  suggestionPreferences: {
    type: 'object',
    default: {},
    patternProperties: {
      '^.*$': {
        type: 'boolean',
      },
    },
  },
  dailyProgress: {
    type: 'object',
    default: {},
    properties: {
      lastResetDate: {
        type: 'string',
        default: new Date().toISOString().split('T')[0],
      },
      notifications: {
        type: 'array',
        default: [],
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            scheduleId: { type: 'string' },
            scheduleName: { type: 'string' },
            timestamp: { type: 'string' },
            wasShown: { type: 'boolean' },
            completed: { type: 'boolean', default: false },
          },
          required: [
            'id',
            'scheduleId',
            'scheduleName',
            'timestamp',
            'wasShown',
          ],
        },
      },
    },
  },
  doNotDisturbSchedules: {
    type: 'array',
    default: [],
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        days: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
          },
        },
        times: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              startTime: { type: 'string' },
              endTime: { type: 'string' },
            },
            required: ['startTime', 'endTime'],
          },
        },
        enabled: { type: 'boolean' },
      },
      required: ['id', 'name', 'days', 'times', 'enabled'],
    },
  },
};

const store = new Store<{
  settings: Settings;
  schedules: Schedule[];
  likedSuggestions: string[];
  dislikedSuggestions: string[];
  dailyProgress: DailyProgress;
  suggestionPreferences: SuggestionPreferences;
  doNotDisturbSchedules: DoNotDisturbSchedule[];
}>({ schema });

export default store;
