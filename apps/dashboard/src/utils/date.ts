export const formatTime = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};
