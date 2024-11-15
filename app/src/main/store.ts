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
import { ProductivityHistory } from '../shared/types/monitor';
import STORE from '../shared/constants/store';

const storeSchema = {
  settings: {
    type: 'object',
    default: {},
    properties: {
      updateBetaReleases: {
        type: 'boolean',
        default: STORE.UPDATE_BETA_RELEASES.DEFAULT,
      },
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
      productivityHistoryLength: {
        type: 'number',
        default: STORE.PRODUCTIVITY_HISTORY_LENGTH.DEFAULT,
        minimum: STORE.PRODUCTIVITY_HISTORY_LENGTH.MINIMUM,
        maximum: STORE.PRODUCTIVITY_HISTORY_LENGTH.MAXIMUM,
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
  productivityHistory: {
    type: 'object',
    properties: {
      periods: {
        type: 'array',
        default: [],
        items: {
          type: 'object',
          properties: {
            startTime: { type: 'string' },
            endTime: { type: 'string' },
            activePercentage: { type: 'number' },
          },
          required: ['startTime', 'endTime', 'activePercentage'],
        },
      },
      lastResetDate: {
        type: 'string',
        default: new Date().toISOString().split('T')[0],
      },
    },
    default: {
      periods: [],
      lastResetDate: new Date().toISOString().split('T')[0],
    },
  },
};

const migrations = {
  '1.0.0': (store: any) => {
    // Validate and fix settings
    const defaultSettings = storeSchema.settings.default;
    const settings = store.get('settings', defaultSettings);
    Object.keys(storeSchema.settings.properties).forEach((key) => {
      const value = settings[key];
      const propertySchema = storeSchema.settings.properties[key];

      // If value violates schema constraints, use default
      if (
        typeof propertySchema.minimum === 'number' &&
        value < propertySchema.minimum
      ) {
        settings[key] = propertySchema.default;
      }
      if (
        typeof propertySchema.maximum === 'number' &&
        value > propertySchema.maximum
      ) {
        settings[key] = propertySchema.default;
      }
      if (propertySchema.type === 'boolean' && typeof value !== 'boolean') {
        settings[key] = propertySchema.default;
      }
    });
    store.set('settings', settings);

    // Reset other properties to defaults if they don't match schema
    ['schedules', 'dailyProgress', 'doNotDisturbSchedules'].forEach((key) => {
      try {
        const value = store.get(key);
        if (!Array.isArray(value) && storeSchema[key].type === 'array') {
          store.set(key, storeSchema[key].default);
        }
      } catch {
        store.set(key, storeSchema[key].default);
      }
    });
  },
};

// Add this before the store initialization
const createStoreWithFallback = <T extends object>({
  schema,
  ...options
}: any): Store<T> => {
  try {
    return new Store<T>({ schema, ...options });
  } catch (error) {
    // If validation error occurs, create a new store without schema validation first
    const tempStore = new Store<T>({ ...options, schema: undefined });

    // Fix any invalid values
    Object.entries(schema).forEach(([key, schemaItem]: [string, any]) => {
      try {
        const currentValue = tempStore.get(key);

        if (schemaItem.type === 'object' && schemaItem.properties) {
          const fixedValue = { ...schemaItem.default };
          Object.entries(schemaItem.properties).forEach(
            ([propKey, propSchema]: [string, any]) => {
              const value = currentValue?.[propKey];

              if (value !== undefined) {
                if (
                  typeof propSchema.minimum === 'number' &&
                  value < propSchema.minimum
                ) {
                  fixedValue[propKey] = propSchema.default;
                } else if (
                  typeof propSchema.maximum === 'number' &&
                  value > propSchema.maximum
                ) {
                  fixedValue[propKey] = propSchema.default;
                } else {
                  fixedValue[propKey] = value;
                }
              }
            },
          );
          tempStore.set(key, fixedValue);
        }
      } catch {
        tempStore.set(key, schemaItem.default);
      }
    });

    // Now create a new store with schema validation using the fixed values
    return new Store<T>({ schema, ...options });
  }
};

// Update the store initialization to use the new creator
const store = createStoreWithFallback<{
  settings: Settings;
  schedules: Schedule[];
  likedSuggestions: string[];
  dislikedSuggestions: string[];
  dailyProgress: DailyProgress;
  suggestionPreferences: SuggestionPreferences;
  doNotDisturbSchedules: DoNotDisturbSchedule[];
  productivityHistory: ProductivityHistory;
}>({
  schema: storeSchema,
  migrations,
  version: '1.0.0',
});

// Add a safety wrapper for getting values
const safeGet = <T>(key: string, defaultValue: T): T => {
  try {
    const value = store.get(key);
    return value === undefined ? defaultValue : (value as T);
  } catch {
    return defaultValue;
  }
};

// Export both the store and safe getter

(async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      await store.openInEditor();
      // eslint-disable-next-line no-console
      console.log('Store file opened in editor');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to open store in editor:', error);
    }
  }
})();

export default store;

export { safeGet };
