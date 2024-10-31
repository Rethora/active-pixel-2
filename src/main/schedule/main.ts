import { ipcMain, IpcMainEvent } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import {
  PartialScheduleWithoutId,
  Schedule,
  ScheduleWithoutId,
} from '../../shared/types/schedule';
import { addCronJob, deleteCronJob, editCronJob } from './util';
import storePromise from '../store';

ipcMain.on('get-schedules', async (event: IpcMainEvent) => {
  const store = await storePromise;
  const schedules = (await store.get('schedules')) as Schedule[];

  event.returnValue = schedules;
});

ipcMain.on('get-schedule', async (event: IpcMainEvent, id: string) => {
  const store = await storePromise;
  const schedules = (await store.get('schedules')) as Schedule[];
  const schedule = schedules.find((s) => s.id === id);

  event.returnValue = schedule;
});

ipcMain.on(
  'add-schedule',
  async (event: IpcMainEvent, schedule: ScheduleWithoutId) => {
    const store = await storePromise;
    const schedules = (await store.get('schedules')) as Schedule[];
    const newSchedule: Schedule = { ...schedule, id: uuidv4() };
    store.set('schedules', [...schedules, newSchedule]);
    addCronJob(newSchedule);

    event.returnValue = newSchedule;
  },
);

ipcMain.on(
  'update-schedule',
  async (
    event: IpcMainEvent,
    scheduleId: string,
    schedule: PartialScheduleWithoutId,
  ) => {
    const store = await storePromise;
    const schedules = (await store.get('schedules')) as Schedule[];
    const scheduleToUpdate = schedules.find((s) => s.id === scheduleId);
    if (!scheduleToUpdate) {
      throw new Error(`Schedule with id ${scheduleId} not found`);
    }
    const updatedSchedule = { ...scheduleToUpdate, ...schedule };
    const updatedSchedules = schedules.map((s) =>
      s.id === scheduleId ? updatedSchedule : s,
    );
    store.set('schedules', updatedSchedules);
    editCronJob(scheduleId, updatedSchedule);

    event.returnValue = updatedSchedule;
  },
);

ipcMain.on('delete-schedule', async (event: IpcMainEvent, id: string) => {
  const store = await storePromise;
  const schedules = (await store.get('schedules')) as Schedule[];
  const updatedSchedules = schedules.filter((s) => s.id !== id);
  store.set('schedules', updatedSchedules);
  deleteCronJob(id);

  event.returnValue = id;
});
