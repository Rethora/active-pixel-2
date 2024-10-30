import nodeSchedule from 'node-schedule';
import { Schedule } from '../../shared/types/schedule';
import { getState, setState } from '../state';
import storePromise from '../store';
import showSuggestionNotification from '../notifications/suggestion';

function omit(
  scheduledJobs: Record<string, nodeSchedule.Job>,
  id: string,
): Record<string, nodeSchedule.Job> | undefined {
  return Object.fromEntries(
    Object.entries(scheduledJobs).filter(([key]) => key !== id),
  );
}

export const addCronJob = (schedule: Schedule) => {
  if (!schedule.enabled) {
    console.log(`Cron job disabled, not scheduling: ${schedule.name}`);
    return;
  }
  const { time, name, id } = schedule;
  const { scheduledJobs } = getState();
  const job = nodeSchedule.scheduleJob(time, () => {
    showSuggestionNotification(schedule);
  });
  setState({ scheduledJobs: { ...scheduledJobs, [id]: job } });
  console.log(`Cron job added: ${name}`);
};

export const editCronJob = (id: string, schedule: Omit<Schedule, 'id'>) => {
  const { scheduledJobs } = getState();
  scheduledJobs[id]?.cancel();
  addCronJob({ ...schedule, id });
};

export const deleteCronJob = (id: string) => {
  const { scheduledJobs } = getState();
  scheduledJobs[id]?.cancel();
  setState({ scheduledJobs: omit(scheduledJobs, id) });
};

export const handleSchedules = async () => {
  const { scheduledJobs } = getState();
  Object.values(scheduledJobs).forEach((job) => job.cancel());
  const store = await storePromise;
  const schedules = (await store.get('schedules')) as Schedule[];
  schedules.forEach((schedule) => addCronJob(schedule));
};
