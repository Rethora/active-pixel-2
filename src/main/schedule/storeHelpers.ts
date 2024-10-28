import { Schedule } from '../../shared/types/schedule';
import storePromise from '../store';

export default (async () => {
  const store = await storePromise;

  const getSchedules = async () => store.get('schedules') as Schedule[];

  const addSchedule = async (schedule: Schedule) => {
    const schedules = await getSchedules();
    store.set('tasks', [...schedules, schedule]);
  };

  const updateSchedule = async (
    scheduleId: string,
    schedule: Omit<Schedule, 'id'>,
  ) => {
    const schedules = await getSchedules();
    store.set(
      'tasks',
      schedules.map((s) => (s.id === scheduleId ? { ...s, ...schedule } : s)),
    );
  };

  const deleteSchedule = async (id: string) => {
    const schedules = await getSchedules();
    store.set(
      'tasks',
      schedules.filter((s) => s.id !== id),
    );
  };

  return { getSchedules, addSchedule, updateSchedule, deleteSchedule };
})();
