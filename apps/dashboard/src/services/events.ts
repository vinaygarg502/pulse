import { config } from '@/config/env';

export const getEventsData = async () => {
  const response = await fetch(`${config.API_URL}/events`);
  const events = await response.json();
  return events.data;
};
