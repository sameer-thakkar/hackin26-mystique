export const CITY_DROP_TIMES = {
  ROME: 7, // 7AM UTC
  PARIS: 8, // 8AM UTC
} as const;

export const getNextDropCountdown = (cityCode: string): string => {
  const now = new Date();
  const currentUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  const dropHour =
    CITY_DROP_TIMES[cityCode as keyof typeof CITY_DROP_TIMES] || 7;
  const todayDrop = new Date(currentUTC);

  todayDrop.setUTCHours(dropHour, 0, 0, 0);

  let nextDrop = todayDrop;
  if (currentUTC >= todayDrop) {
    nextDrop = new Date(todayDrop);
    nextDrop.setUTCDate(nextDrop.getUTCDate() + 1);
  }

  const timeDiff = nextDrop.getTime() - currentUTC.getTime();
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  const formatTime = (num: number): string => num.toString().padStart(2, '0');

  return `${formatTime(hours)} : ${formatTime(minutes)} : ${formatTime(
    seconds
  )}`;
};
