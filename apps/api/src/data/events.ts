import { allowedEventTypes, AllowedEventType } from '../constants/eventTypes.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export interface Event {
  readonly id: number;
  readonly type: string;
  readonly url: string;
  readonly createdAt: Date;
}
let id: number = 1;
const events: Event[] = [];

const generateId = (): number => {
  const nextId = id++;
  return nextId;
};

export const addEvent = (eventData: { readonly type: AllowedEventType; url: string }): Event => {
  if (!eventData.type) {
    throw new BadRequestError('Type is required');
  }
  if (typeof eventData.type !== 'string') {
    throw new BadRequestError('Type must be string');
  }
  if (!allowedEventTypes.has(eventData.type)) {
    throw new BadRequestError('Invalid Event Type');
  }
  if (!eventData.url) {
    throw new BadRequestError('Url is required');
  }
  if (typeof eventData.url !== 'string') {
    throw new BadRequestError('Url must be string');
  }
  const newEvent: Event = {
    type: eventData.type,
    url: eventData.url,
    id: generateId(),
    createdAt: new Date(),
  };
  events.push(newEvent);
  return newEvent;
};
export const getEvents = (): Event[] => {
  return events.map((event) => ({ ...event }));
};
export const getEventById = (id: number): Event => {
  const event = events.find((event) => event.id === id);
  if (!event) {
    throw new NotFoundError('Event Not Found');
  }
  return event;
};
export const fetchId = (url: string | undefined): number => {
  return Number(url?.split('/').pop());
};
