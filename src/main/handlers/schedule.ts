import { ipcMain } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import { Schedule } from '../../shared/types/schedule';
import { addCronJob, deleteCronJob, editCronJob } from '../schedule/util';
import store from '../store';
import { HandlerPayload } from '../../shared/types/ipc';

export default () => {
  ipcMain.handle('get-schedules', () => {
    const schedules = store.get('schedules');
    return schedules;
  });

  ipcMain.handle(
    'get-schedule',
    (_, payload: HandlerPayload<'get-schedule'>) => {
      const schedules = store.get('schedules');
      const schedule = schedules.find((s) => s.id === payload);
      return schedule;
    },
  );

  ipcMain.handle(
    'add-schedule',
    async (_, payload: HandlerPayload<'add-schedule'>) => {
      const schedules = store.get('schedules');
      const newSchedule: Schedule = { ...payload, id: uuidv4() };
      store.set('schedules', [...schedules, newSchedule]);
      addCronJob(newSchedule);

      return newSchedule;
    },
  );

  ipcMain.handle(
    'update-schedule',
    async (_, payload: HandlerPayload<'update-schedule'>) => {
      const schedules = store.get('schedules');
      const scheduleToUpdate = schedules.find((s) => s.id === payload.id);
      if (!scheduleToUpdate) {
        throw new Error(`Schedule with id ${payload.id} not found`);
      }
      const updatedSchedule = {
        ...scheduleToUpdate,
        ...payload.updatedSchedule,
      };
      const updatedSchedules = schedules.map((s) =>
        s.id === payload.id ? updatedSchedule : s,
      );
      store.set('schedules', updatedSchedules);
      editCronJob(payload.id, updatedSchedule);

      return updatedSchedule;
    },
  );

  ipcMain.handle(
    'delete-schedule',
    async (_, payload: HandlerPayload<'delete-schedule'>) => {
      const schedules = store.get('schedules');
      const updatedSchedules = schedules.filter((s) => s.id !== payload);
      store.set('schedules', updatedSchedules);
      deleteCronJob(payload);

      return payload;
    },
  );
};
