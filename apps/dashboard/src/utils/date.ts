export const formatTime = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`;
  }

  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }

  return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} ${
    remainingMinutes === 1 ? 'minute' : 'minutes'
  }`;
};
