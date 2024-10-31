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
};

export default (async () => {
  const Store = (await import('electron-store')).default;

  const store = new Store({ schema });

  return store;
})();
