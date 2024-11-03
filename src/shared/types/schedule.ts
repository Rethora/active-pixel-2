import { SuggestionFilters } from './suggestion';

export interface Schedule {
  id: string;
  name: string;
  time: string; // cron expression e.g., '0 9 * * *' for 9 AM every day
  enabled: boolean;
  filters: SuggestionFilters;
  silenceNotificationsUntil: string | null;
}

export type ScheduleWithoutId = Omit<Schedule, 'id'>;

export type PartialScheduleWithoutId = Partial<ScheduleWithoutId>;

export type DailyProgressNotification = {
  id: string;
  scheduleId: string;
  scheduleName: string;
  timestamp: string;
  wasShown: boolean;
  completed: boolean;
};

export type DailyProgress = {
  lastResetDate: string;
  notifications: DailyProgressNotification[];
};
