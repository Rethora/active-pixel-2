import { ipcMain } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import store from '../store';
import { HandlerReturn, HandlerPayload } from '../../shared/types/ipc';
import { DoNotDisturbSchedule } from '../../shared/types/doNotDisturbSchedules';

export default () => {
  ipcMain.handle(
    'get-do-not-disturb-schedules',
    (): HandlerReturn<'get-do-not-disturb-schedules'> => {
      const schedules = store.get('doNotDisturbSchedules');
      return schedules;
    },
  );

  ipcMain.handle(
    'add-do-not-disturb-schedule',
    (
      _,
      payload: HandlerPayload<'add-do-not-disturb-schedule'>,
    ): HandlerReturn<'add-do-not-disturb-schedule'> => {
      const schedules = store.get('doNotDisturbSchedules');
      const newSchedule: DoNotDisturbSchedule = { ...payload, id: uuidv4() };
      store.set('doNotDisturbSchedules', [...schedules, newSchedule]);
      return newSchedule;
    },
  );

  ipcMain.handle(
    'get-do-not-disturb-schedule',
    (
      _,
      payload: HandlerPayload<'get-do-not-disturb-schedule'>,
    ): HandlerReturn<'get-do-not-disturb-schedule'> => {
      const schedules = store.get('doNotDisturbSchedules');
      const schedule = schedules.find((s) => s.id === payload);
      return schedule;
    },
  );

  ipcMain.handle(
    'update-do-not-disturb-schedule',
    (
      _,
      payload: HandlerPayload<'update-do-not-disturb-schedule'>,
    ): HandlerReturn<'update-do-not-disturb-schedule'> => {
      const schedules = store.get('doNotDisturbSchedules');
      const scheduleToUpdate = schedules.find((s) => s.id === payload.id);
      if (!scheduleToUpdate) {
        throw new Error(
          `Do not disturb schedule with id ${payload.id} not found`,
        );
      }
      const updatedSchedule = {
        ...scheduleToUpdate,
        ...payload.updatedSchedule,
      };
      const updatedSchedules = schedules.map((s) =>
        s.id === payload.id ? updatedSchedule : s,
      );
      store.set('doNotDisturbSchedules', updatedSchedules);
      return updatedSchedule;
    },
  );

  ipcMain.handle(
    'delete-do-not-disturb-schedule',
    (
      _,
      payload: HandlerPayload<'delete-do-not-disturb-schedule'>,
    ): HandlerReturn<'delete-do-not-disturb-schedule'> => {
      const schedules = store.get('doNotDisturbSchedules');
      const scheduleToDelete = schedules.find((s) => s.id === payload);
      if (!scheduleToDelete) {
        throw new Error(`Do not disturb schedule with id ${payload} not found`);
      }
      store.set(
        'doNotDisturbSchedules',
        schedules.filter((s) => s.id !== scheduleToDelete.id),
      );
      return scheduleToDelete;
    },
  );
};
