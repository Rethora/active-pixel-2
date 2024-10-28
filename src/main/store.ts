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
  },
};

export default (async () => {
  const Store = (await import('electron-store')).default;

  const store = new Store({ schema });

  return store;
})();
