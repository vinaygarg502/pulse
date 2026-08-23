import { config } from '@/config/env';

export const getLogsData = async (signal: AbortSignal) => {
  const response = await fetch(`${config.API_URL}/logs`, { signal });
  const logs = await response.json();
  return logs.data;
};
