import { ipcMain } from 'electron';
import storeHelpersPromise from './storeHelpers';

(async () => {
  const { getSchedules, addSchedule, updateSchedule, deleteSchedule } =
    await storeHelpersPromise;

  ipcMain.on('get-schedules', async (event) => {
    event.returnValue = await getSchedules();
  });

  ipcMain.on('add-schedule', async (event, schedule) => {
    await addSchedule(schedule);
  });

  ipcMain.on('update-schedule', async (event, scheduleId, schedule) => {
    await updateSchedule(scheduleId, schedule);
  });

  ipcMain.on('delete-schedule', async (event, id) => {
    await deleteSchedule(id);
  });
})();
