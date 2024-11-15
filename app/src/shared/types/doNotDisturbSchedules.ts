export type DayOfWeek = 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

export type DoNotDisturbScheduleTime = {
  startTime: string;
  endTime: string;
};

export type DoNotDisturbSchedule = {
  id: string;
  name: string;
  days: DayOfWeek[];
  times: DoNotDisturbScheduleTime[];
  enabled: boolean;
};

export type DoNotDisturbScheduleWithoutId = Omit<DoNotDisturbSchedule, 'id'>;

export type PartialDoNotDisturbSchedule = Partial<DoNotDisturbSchedule>;

export type PartialDoNotDisturbScheduleWithoutId =
  Partial<DoNotDisturbScheduleWithoutId>;
