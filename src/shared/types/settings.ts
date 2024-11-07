export type Settings = {
  displayUnproductiveNotifications: boolean;
  productivityThresholdPercentage: number;
  productivityCheckInterval: number;
  runInBackground: boolean;
  runOnStartup: boolean;
  showWindowOnStartup: boolean;
  upNextRange: number; // in hours
  maxUpNextItems: number;
  doNotDisturb: boolean;
  turnOffDoNotDisturbAt: string | null;
  productivityHistoryLength: number;
};

export type PartialSettings = Partial<Settings>;
