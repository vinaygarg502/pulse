import type { DashboardEvent, Event } from './types';

export const getEvent = (event: Event) => {
  return {
    id: event.id,
    time: event.createdAt,
    eventUrl: event.url,
    eventType: event.type,
  };
};
export const getEvents = (events: Event[]): DashboardEvent[] => {
  return events.map(getEvent);
};
