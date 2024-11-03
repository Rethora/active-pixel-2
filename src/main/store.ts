import {
  Category,
  Equipment,
  Force,
  Level,
  Mechanic,
  PrimaryMuscles,
  SecondaryMuscles,
} from '../shared/types/suggestion';

const schema = {
  settings: {
    type: 'object',
    default: {},
    properties: {
      displayUnproductiveNotifications: {
        type: 'boolean',
        default: false,
      },
      productivityThresholdPercentage: {
        type: 'number',
        default: 70,
        minimum: 0,
        maximum: 100,
      },
      productivityCheckInterval: {
        type: 'number',
        default: 600000,
        minimum: 300000,
      },
      runInBackground: {
        type: 'boolean',
        default: false,
      },
      runOnStartup: {
        type: 'boolean',
        default: false,
      },
      showWindowOnStartup: {
        type: 'boolean',
        default: true,
      },
      upNextRange: {
        type: 'number',
        default: 24,
        minimum: 1,
        maximum: 168,
      },
      maxUpNextItems: {
        type: 'number',
        default: 5,
        minimum: 1,
        maximum: 5,
      },
      doNotDisturb: {
        type: 'boolean',
        default: false,
      },
      turnOffDoNotDisturbAt: {
        type: ['string', 'null'],
        default: null,
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
  likedSuggestions: {
    type: 'array',
    default: [],
    items: {
      type: 'string', // suggestion IDs
    },
  },
  dislikedSuggestions: {
    type: 'array',
    default: [],
    items: {
      type: 'string', // suggestion IDs
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
};

export default (async () => {
  const Store = (await import('electron-store')).default;

  const store = new Store({ schema });

  return store;
})();
