/* eslint-disable @typescript-eslint/no-unused-vars */

import { Settings, PartialSettings } from './settings';
import {
  Schedule,
  ScheduleWithoutId,
  PartialScheduleWithoutId,
  DailyProgress,
} from './schedule';

// Define handler types separately for better type inference
type HandlerTypes = {
  'get-settings': {
    args: [];
    return: Settings;
  };
  'update-settings': {
    args: [settings: PartialSettings];
    return: Settings;
  };
  'get-schedules': {
    args: [];
    return: Schedule[];
  };
  'get-schedule': {
    args: [id: string];
    return: Schedule | undefined;
  };
  'add-schedule': {
    args: [schedule: ScheduleWithoutId];
    return: Schedule;
  };
  'update-schedule': {
    args: [id: string, schedule: PartialScheduleWithoutId];
    return: Schedule;
  };
  'delete-schedule': {
    args: [id: string];
    return: string;
  };
  'get-daily-progress': {
    args: [];
    return: DailyProgress;
  };
  test: {
    args: [];
    return: string;
  };
} & Record<string, never>;

// Channel configuration using the handler types
export const channelConfig = {
  'get-settings': {
    handler: (() => {}) as () => Promise<
      HandlerTypes['get-settings']['return']
    >,
  },
  'update-settings': {
    handler: ((settings: PartialSettings) => {}) as (
      ...args: HandlerTypes['update-settings']['args']
    ) => Promise<HandlerTypes['update-settings']['return']>,
  },
  'get-schedules': {
    handler: (() => {}) as () => Promise<
      HandlerTypes['get-schedules']['return']
    >,
  },
  'get-schedule': {
    handler: ((id: string) => {}) as (
      ...args: HandlerTypes['get-schedule']['args']
    ) => Promise<HandlerTypes['get-schedule']['return']>,
  },
  'add-schedule': {
    handler: ((schedule: ScheduleWithoutId) => {}) as (
      ...args: HandlerTypes['add-schedule']['args']
    ) => Promise<HandlerTypes['add-schedule']['return']>,
  },
  'update-schedule': {
    handler: ((id: string, schedule: PartialScheduleWithoutId) => {}) as (
      ...args: HandlerTypes['update-schedule']['args']
    ) => Promise<HandlerTypes['update-schedule']['return']>,
  },
  'delete-schedule': {
    handler: ((id: string) => {}) as (
      ...args: HandlerTypes['delete-schedule']['args']
    ) => Promise<HandlerTypes['delete-schedule']['return']>,
  },
  'get-daily-progress': {
    handler: (() => {}) as () => Promise<
      HandlerTypes['get-daily-progress']['return']
    >,
  },
  test: {
    handler: (() => {}) as () => Promise<HandlerTypes['test']['return']>,
  },
} as const;

export type ChannelConfig = typeof channelConfig;
export type IpcChannels = keyof typeof channelConfig;

// Utility types for getting handler args and return types
export type HandlerArgs<T extends IpcChannels> = HandlerTypes[T]['args'];
export type HandlerReturn<T extends IpcChannels> = HandlerTypes[T]['return'];
