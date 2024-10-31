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
    return;
  }
  const { time, id } = schedule;
  const { scheduledJobs } = getState();
  const job = nodeSchedule.scheduleJob(time, () => {
    showSuggestionNotification(schedule);
  });
  setState({ scheduledJobs: { ...scheduledJobs, [id]: job } });
};

export const editCronJob = (id: string, schedule: Schedule) => {
  const { scheduledJobs } = getState();
  const scheduleToUpdate = scheduledJobs[id];
  scheduleToUpdate?.cancel();
  addCronJob(schedule);
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
