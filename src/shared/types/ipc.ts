import { Settings, PartialSettings } from './settings';
import {
  Schedule,
  ScheduleWithoutId,
  PartialScheduleWithoutId,
  DailyProgress,
} from './schedule';
import { SuggestionWithAddProps } from './suggestion';
import {
  DoNotDisturbSchedule,
  DoNotDisturbScheduleWithoutId,
  PartialDoNotDisturbScheduleWithoutId,
} from './doNotDisturbSchedules';
import { ProductivityPeriod } from './monitor';

// Define handler types separately for better type inference
export type HandlerTypes = {
  'get-settings': {
    payload: null;
    return: Settings;
  };
  'update-settings': {
    payload: PartialSettings;
    return: Settings;
  };
  'get-schedules': {
    payload: null;
    return: Schedule[];
  };
  'get-schedule': {
    payload: string;
    return: Schedule | undefined;
  };
  'add-schedule': {
    payload: ScheduleWithoutId;
    return: Schedule;
  };
  'update-schedule': {
    payload: { id: string; updatedSchedule: PartialScheduleWithoutId };
    return: Schedule;
  };
  'delete-schedule': {
    payload: string;
    return: Schedule;
  };
  'get-all-suggestions-with-add-props': {
    payload: null;
    return: SuggestionWithAddProps[];
  };
  'get-suggestion-with-add-props-by-id': {
    payload: string;
    return: SuggestionWithAddProps;
  };
  'get-liked-suggestions': {
    payload: null;
    return: string[];
  };
  'get-disliked-suggestions': {
    payload: null;
    return: string[];
  };
  'add-liked-suggestion': {
    payload: string;
    return: string[];
  };
  'add-disliked-suggestion': {
    payload: string;
    return: string[];
  };
  'remove-feedback': {
    payload: string;
    return: void;
  };
  'get-daily-progress': {
    payload: null;
    return: DailyProgress;
  };
  'toggle-notification-completion': {
    payload: string;
    return: DailyProgress;
  };
  'get-do-not-disturb-schedules': {
    payload: null;
    return: DoNotDisturbSchedule[];
  };
  'get-do-not-disturb-schedule': {
    payload: string;
    return: DoNotDisturbSchedule | undefined;
  };
  'add-do-not-disturb-schedule': {
    payload: DoNotDisturbScheduleWithoutId;
    return: DoNotDisturbSchedule;
  };
  'update-do-not-disturb-schedule': {
    payload: {
      id: string;
      updatedSchedule: PartialDoNotDisturbScheduleWithoutId | undefined;
    };
    return: DoNotDisturbSchedule;
  };
  'delete-do-not-disturb-schedule': {
    payload: string;
    return: DoNotDisturbSchedule;
  };
  'get-current-productivity': {
    payload: null;
    return: ProductivityPeriod;
  };
  'get-productivity-history': {
    payload: null;
    return: ProductivityPeriod[];
  };
};

export type IpcChannels = keyof HandlerTypes;

// Utility types for getting handler args and return types
export type HandlerPayload<T extends IpcChannels> = HandlerTypes[T]['payload'];
export type HandlerReturn<T extends IpcChannels> = HandlerTypes[T]['return'];
