/* eslint-disable @typescript-eslint/no-unused-vars */

import { Settings, PartialSettings } from './settings';
import {
  Schedule,
  ScheduleWithoutId,
  PartialScheduleWithoutId,
  DailyProgress,
} from './schedule';

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
    return: string;
  };
  'get-daily-progress': {
    payload: null;
    return: DailyProgress;
  };
};

export type IpcChannels = keyof HandlerTypes;

// Utility types for getting handler args and return types
export type HandlerPayload<T extends IpcChannels> = HandlerTypes[T]['payload'];
export type HandlerReturn<T extends IpcChannels> = HandlerTypes[T]['return'];
