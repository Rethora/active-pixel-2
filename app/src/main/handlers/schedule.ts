import { ipcMain } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import { Schedule } from '../../shared/types/schedule';
import { addCronJob, deleteCronJob, editCronJob } from '../schedule/util';
import store from '../store';
import { HandlerPayload, HandlerReturn } from '../../shared/types/ipc';

export default () => {
  ipcMain.handle('get-schedules', (): HandlerReturn<'get-schedules'> => {
    const schedules = store.get('schedules');
    return schedules;
  });

  ipcMain.handle(
    'get-schedule',
    (
      _,
      payload: HandlerPayload<'get-schedule'>,
    ): HandlerReturn<'get-schedule'> => {
      const schedules = store.get('schedules');
      const schedule = schedules.find((s) => s.id === payload);
      return schedule;
    },
  );

  ipcMain.handle(
    'add-schedule',
    (
      _,
      payload: HandlerPayload<'add-schedule'>,
    ): HandlerReturn<'add-schedule'> => {
      const schedules = store.get('schedules');
      const newSchedule: Schedule = { ...payload, id: uuidv4() };
      store.set('schedules', [...schedules, newSchedule]);
      addCronJob(newSchedule);

      return newSchedule;
    },
  );

  ipcMain.handle(
    'update-schedule',
    (
      _,
      payload: HandlerPayload<'update-schedule'>,
    ): HandlerReturn<'update-schedule'> => {
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
    (
      _,
      payload: HandlerPayload<'delete-schedule'>,
    ): HandlerReturn<'delete-schedule'> => {
      const schedules = store.get('schedules');
      const scheduleToDelete = schedules.find((s) => s.id === payload);
      if (!scheduleToDelete) {
        throw new Error(`Schedule with id ${payload} not found`);
      }
      store.set(
        'schedules',
        schedules.filter((s) => s.id !== scheduleToDelete.id),
      );
      deleteCronJob(payload);

      return scheduleToDelete;
    },
  );
};
