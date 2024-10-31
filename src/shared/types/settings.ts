export type Settings = {
  displayUnproductiveNotifications: boolean;
  productivityThresholdPercentage: number;
  productivityCheckInterval: number;
  runInBackground: boolean;
  runOnStartup: boolean;
  showWindowOnStartup: boolean;
};

export type PartialSettings = Partial<Settings>;
