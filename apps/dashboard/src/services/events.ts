import { config } from '@/config/env';

export const getEventsData = async (signal: AbortSignal) => {
  const response = await fetch(`${config.API_URL}/events`, { signal });
  const events = await response.json();
  return events.data;
};
