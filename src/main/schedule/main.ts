import { ipcMain } from 'electron';
import storeHelpersPromise from './storeHelpers';
import { Schedule } from '../../shared/types/schedule';
import { addCronJob, deleteCronJob, editCronJob } from './util';

(async () => {
  const {
    getSchedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedule,
    updateScheduleEnabled,
  } = await storeHelpersPromise;

  ipcMain.on('get-schedules', async (event) => {
    event.returnValue = await getSchedules();
  });

  ipcMain.on('get-schedule', async (event, id) => {
    event.returnValue = await getSchedule(id);
  });

  ipcMain.on('add-schedule', async (event, schedule: Omit<Schedule, 'id'>) => {
    const newSchedule = await addSchedule(schedule);
    addCronJob(newSchedule);
  });

  ipcMain.on('update-schedule', async (event, scheduleId, schedule) => {
    await updateSchedule(scheduleId, schedule);
    editCronJob(scheduleId, schedule);
  });

  ipcMain.on('delete-schedule', async (event, id) => {
    await deleteSchedule(id);
    deleteCronJob(id);
  });

  ipcMain.on('update-schedule-enabled', async (event, id, enabled) => {
    await updateScheduleEnabled(id, enabled);
  });
})();
