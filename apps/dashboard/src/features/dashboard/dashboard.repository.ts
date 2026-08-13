import { getEventsData } from '@/services/events';
import { getEvents } from './event.mapper';

export const getDashboardEvents = async () => {
  const events = await getEventsData();
  return getEvents(events);
};
