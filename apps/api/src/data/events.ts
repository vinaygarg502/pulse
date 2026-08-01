import {
  allowedEventTypes,
  AllowedEventType,
  allowedKeys,
  AllowedKeys,
  EventInput,
} from '../constants/eventTypes.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export interface Event {
  readonly id: number;
  readonly type: string;
  readonly url: string;
  readonly createdAt: Date;
  updatedAt?: Date;
}
let id: number = 1;
const events: Event[] = [];

const generateId = (): number => {
  const nextId = id++;
  return nextId;
};

const validateObject = (eventData: unknown): Record<string, unknown> => {
  if (typeof eventData !== 'object' || eventData === null) {
    throw new BadRequestError('Invalid Request Body');
  }
  return eventData as Record<string, unknown>;
};

const checkAllowedKeys = (data: Record<string, unknown>): void => {
  for (const key of Object.keys(data)) {
    if (!allowedKeys.has(key as AllowedKeys)) {
      throw new BadRequestError(`Unexpected field: ${key}`);
    }
  }
};
const validateType = (type: unknown): AllowedEventType => {
  if (typeof type !== 'string') {
    throw new BadRequestError('Type must be a string');
  }

  if (type.trim() === '') {
    throw new BadRequestError('Type must not be empty');
  }
  if (!allowedEventTypes.has(type as AllowedEventType)) {
    throw new BadRequestError('Invalid Event Type');
  }
  return type as AllowedEventType;
};
const validateUrl = (url: unknown): string => {
  if (typeof url !== 'string') {
    throw new BadRequestError('Url must be string');
  }
  if (url.trim() === '') {
    throw new BadRequestError('Url must not be empty');
  }
  return url;
};

export const validateEvent = (eventData: unknown): EventInput => {
  const data = validateObject(eventData);
  checkAllowedKeys(data);
  if (data.type === undefined) {
    throw new BadRequestError('Type is required');
  }

  if (data.url === undefined) {
    throw new BadRequestError('Url is required');
  }

  return {
    type: validateType(data.type),
    url: validateUrl(data.url),
  };
};
export const validatePatchEvent = (eventData: unknown): Partial<EventInput> => {
  const data = validateObject(eventData);
  checkAllowedKeys(data);
  const keys = Object.keys(data);
  if (!keys.length) {
    throw new BadRequestError('At least one field must be present.');
  }

  const input: Partial<EventInput> = {};
  for (const key of keys) {
    switch (key) {
      case 'type': {
        input.type = validateType(data.type);
        break;
      }
      case 'url': {
        input.url = validateUrl(data.url);
        break;
      }
    }
  }
  return input;
};

export const addEvent = (eventInput: EventInput): Event => {
  const newEvent: Event = {
    type: eventInput.type,
    url: eventInput.url,
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
export const deleteEventById = (id: number): void => {
  const eventIndex = events.findIndex((event) => event.id === id);
  if (eventIndex === -1) {
    throw new NotFoundError('Event Not found.');
  }
  events.splice(eventIndex, 1);
};
export const patchEventById = (id: number, event: Partial<EventInput>): Event => {
  const eventIndex = events.findIndex((event) => event.id === id);
  if (eventIndex === -1) {
    throw new NotFoundError('Event Not found.');
  }
  const existingEvent = events[eventIndex];
  const updatedEvent: Event = { ...existingEvent, ...event, updatedAt: new Date() };
  events[eventIndex] = updatedEvent;
  return updatedEvent;
};
export const updateEventById = (id: number, event: EventInput): Event => {
  return patchEventById(id, event);
};
export const fetchId = (url: string | undefined): number => {
  return Number(url?.split('/').pop());
};
