import nodeSchedule from 'node-schedule';
import { Schedule } from '../../shared/types/schedule';
import { getState, setState } from '../state';
import store from '../store';
import showSuggestionNotification from '../notifications/notificationTypes/suggestion';

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
  const { time, id, rescheduled } = schedule;
  const { scheduledJobs } = getState();

  const jobTime = rescheduled ? rescheduled.newTime : time;

  const job = nodeSchedule.scheduleJob(jobTime, () => {
    if (rescheduled) {
      const nextInvocation = job.nextInvocation();
      if (
        nextInvocation &&
        nextInvocation.toISOString() > rescheduled.endTime
      ) {
        // Reset rescheduled to null if next run would be past end time
        store.set(
          'schedules',
          store
            .get('schedules')
            .map((s) => (s.id === id ? { ...s, rescheduled: null } : s)),
        );
      }
    }
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

export const handleSchedules = () => {
  const { scheduledJobs } = getState();
  Object.values(scheduledJobs).forEach((job) => job.cancel());
  const schedules = store.get('schedules');
  schedules.forEach((schedule) => addCronJob(schedule));
};
