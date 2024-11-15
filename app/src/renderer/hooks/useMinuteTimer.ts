import { useEffect } from 'react';

type Callback = () => void;
const listeners = new Set<Callback>();
// eslint-disable-next-line no-undef
let interval: NodeJS.Timeout | null = null;

function startInterval() {
  if (interval) return;

  interval = setInterval(() => {
    listeners.forEach((callback) => callback());
  }, 60000);
}

function stopInterval() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}

/**
 * A hook that runs a callback every minute.
 * @param callback - The callback to run every minute.
 */
export default function useMinuteTimer(callback: Callback) {
  useEffect(() => {
    listeners.add(callback);
    startInterval();

    // Run immediately on mount
    callback();

    return () => {
      listeners.delete(callback);
      if (listeners.size === 0) {
        stopInterval();
      }
    };
  }, [callback]);
}
