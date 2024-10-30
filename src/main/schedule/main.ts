import { ipcMain } from 'electron';
import storeHelpersPromise from './storeHelpers';
import { Schedule } from '../../shared/types/schedule';
import { addCronJob, deleteCronJob, editCronJob } from './util';

(async () => {
  const { getSchedules, addSchedule, updateSchedule, deleteSchedule } =
    await storeHelpersPromise;

  ipcMain.on('get-schedules', async (event) => {
    event.returnValue = await getSchedules();
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
})();
