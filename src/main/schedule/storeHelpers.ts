import { v4 as uuidv4 } from 'uuid';
import { Schedule } from '../../shared/types/schedule';
import storePromise from '../store';

export default (async () => {
  const store = await storePromise;

  const getSchedules = async () => store.get('schedules') as Schedule[];

  const getSchedule = async (id: string) => {
    const schedules = await getSchedules();
    console.log('store schedules', schedules);
    const schedule = schedules.find((s) => s.id === id);
    console.log('schedule', schedule);
    return schedule;
  };

  const addSchedule = async (schedule: Omit<Schedule, 'id'>) => {
    const schedules = await getSchedules();
    const newSchedule = { ...schedule, id: uuidv4() };
    store.set('schedules', [...schedules, newSchedule]);
    return newSchedule;
  };

  const updateSchedule = async (
    scheduleId: string,
    schedule: Omit<Schedule, 'id'>,
  ) => {
    const schedules = await getSchedules();
    try {
      store.set(
        'schedules',
        schedules.map((s) => (s.id === scheduleId ? { ...s, ...schedule } : s)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSchedule = async (id: string) => {
    const schedules = await getSchedules();
    store.set(
      'schedules',
      schedules.filter((s) => s.id !== id),
    );
  };

  const updateScheduleEnabled = async (id: string, enabled: boolean) => {
    const schedules = await getSchedules();
    store.set(
      'schedules',
      schedules.map((s) => (s.id === id ? { ...s, enabled } : s)),
    );
  };

  return {
    getSchedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedule,
    updateScheduleEnabled,
  };
})();
