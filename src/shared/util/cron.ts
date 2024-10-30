import cronParser from 'cron-parser';

const getNextRunTimeString = (value: string) => {
  try {
    const interval = cronParser.parseExpression(value);
    const date = interval.next().toDate();
    return date.toLocaleString('en-US', {
      weekday: 'long',
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (err) {
    console.error(err);
    return 'Invalid cron expression';
  }
};

// eslint-disable-next-line import/prefer-default-export
export { getNextRunTimeString };
