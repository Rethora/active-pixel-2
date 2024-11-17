export type Settings = {
  updateBetaReleases: boolean;
  displayUnproductiveNotifications: boolean;
  displayWorkForTooLongNotification: boolean;
  tooLongThresholdPercentage: number;
  tooLongCheckInterval: number;
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
