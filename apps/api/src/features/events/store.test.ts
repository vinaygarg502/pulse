import { describe, expect, it, beforeEach } from 'vitest';
import { createEventStore, validateEvent, validatePatchEvent } from './store.js';
describe('events/store testcases validateUrl', () => {
  it('should validate a valid Url', () => {
    const result = validateEvent({
      type: 'page_view',
      url: 'https://www.example.com',
    });

    expect(result.url).toBe('https://www.example.com');
  });
  it('should reject non-string type', () => {
    expect(() =>
      validateEvent({
        type: 'page_view',
        url: 123,
      }),
    ).toThrow('Url must be string');
  });
  it('should reject empty type', () => {
    expect(() =>
      validateEvent({
        type: 'page_view',
        url: '   ',
      }),
    ).toThrow('Url must not be empty');
  });
});

describe('events/store testcases validateType', () => {
  it('should validate a valid type', () => {
    const result = validateEvent({
      type: 'page_view',
      url: 'https://www.example.com',
    });

    expect(result.type).toBe('page_view');
  });
  it('should reject non-string type', () => {
    expect(() =>
      validateEvent({
        type: 124,
        url: 'https://www.example.com',
      }),
    ).toThrow('Type must be a string');
  });
  it('should reject empty type', () => {
    expect(() =>
      validateEvent({
        type: '  ',
        url: 'https://www.example.com',
      }),
    ).toThrow('Type must not be empty');
  });
  it('should reject unsupported event type', () => {
    expect(() =>
      validateEvent({
        type: 'page_event',
        url: 'https://www.example.com',
      }),
    ).toThrow('Invalid Event Type');
  });
});

describe('events/store testcases validateEvent', () => {
  it('should reject non-object eventdata', () => {
    expect(() => validateEvent(null)).toThrow('Invalid Request Body');
  });
  it('should reject if key is outside of allowed keys', () => {
    expect(() =>
      validateEvent({
        type: 'page_view',
        id: '1',
        url: 'https://www.example.com',
      }),
    ).toThrow('Unexpected field: id');
  });
  it('should reject if type is not defined', () => {
    expect(() =>
      validateEvent({
        url: 'https://www.example.com',
      }),
    ).toThrow('Type is required');
  });
  it('should reject if url is not defined', () => {
    expect(() =>
      validateEvent({
        type: 'page_view',
      }),
    ).toThrow('Url is required');
  });
  it('should return a valid event', () => {
    const result = validateEvent({
      type: 'page_view',
      url: 'https://www.example.com',
    });
    expect(result).toEqual({
      type: 'page_view',
      url: 'https://www.example.com',
    });
  });
});

describe('events/store testcases validatePatchEvent', () => {
  it('should reject non-object eventdata', () => {
    expect(() => validatePatchEvent(null)).toThrow('Invalid Request Body');
  });
  it('should reject if key is outside of allowed keys', () => {
    expect(() =>
      validatePatchEvent({
        type: 'page_view',
        id: '1',
        url: 'https://www.example.com',
      }),
    ).toThrow('Unexpected field: id');
  });
  it('should reject if object does not have any key', () => {
    expect(() => validatePatchEvent({})).toThrow('At least one field must be present.');
  });
  it('should return a valid type object if type is patched', () => {
    const result = validatePatchEvent({
      type: 'page_view',
    });
    expect(result).toEqual({
      type: 'page_view',
    });
  });
  it('should return a valid url object if url is patched', () => {
    const result = validatePatchEvent({
      url: 'https://www.example.com',
    });
    expect(result).toEqual({
      url: 'https://www.example.com',
    });
  });
  it('should return a valid event', () => {
    const result = validatePatchEvent({
      type: 'page_view',
      url: 'https://www.example.com',
    });
    expect(result).toEqual({
      type: 'page_view',
      url: 'https://www.example.com',
    });
  });
});

describe('addEvent testcases', () => {
  let eventStore: ReturnType<typeof createEventStore>;
  beforeEach(() => {
    eventStore = createEventStore();
  });
  it('should create an event and return an event', () => {
    const event = eventStore.addEvent({
      type: 'page_view',
      url: 'https://www.example.com',
    });
    expect(event.type).toBe('page_view');
    expect(event.url).toBe('https://www.example.com');
    expect(event.id).toBeDefined();
    expect(event.createdAt).toBeInstanceOf(Date);
  });
  it('should add the event to the store', () => {
    const event = eventStore.addEvent({
      type: 'page_view',
      url: 'https://www.example.com',
    });
    const events = eventStore.getEvents();
    expect(events).toContainEqual(event);
  });
});

describe('eventStore.getEvents testcases', () => {
  let eventStore: ReturnType<typeof createEventStore>;
  beforeEach(() => {
    eventStore = createEventStore();
  });
  it('should return all events', () => {
    const event = eventStore.addEvent({
      type: 'page_view',
      url: 'https://www.example.com',
    });
    const events = eventStore.getEvents();
    expect(events).toContainEqual(event);
  });

  it('should return a copy of events collection', () => {
    eventStore.addEvent({
      type: 'page_view',
      url: 'https://www.example.com',
    });
    const events = eventStore.getEvents();
    expect(events).toHaveLength(1);
    events.pop();
    expect(eventStore.getEvents()).toHaveLength(1);
  });
});
describe('eventStore.getEventById testcases', () => {
  let eventStore: ReturnType<typeof createEventStore>;
  beforeEach(() => {
    eventStore = createEventStore();
  });
  it('should return event by id 1', () => {
    const createdEvent = eventStore.addEvent({
      type: 'page_view',
      url: 'https://www.example.com',
    });
    const event = eventStore.getEventById(createdEvent.id);
    expect(event).toEqual(createdEvent);
  });

  it('should throw when event is not found', () => {
    expect(() => eventStore.getEventById(1)).toThrow('Event Not Found');
  });
});

describe('eventStore.deleteEventById testcases', () => {
  let eventStore: ReturnType<typeof createEventStore>;
  beforeEach(() => {
    eventStore = createEventStore();
  });
  it('should delete event by id which exists', () => {
    const createdEvent = eventStore.addEvent({
      type: 'page_view',
      url: 'https://www.example.com',
    });
    expect(eventStore.getEvents()).toContainEqual(createdEvent);
    eventStore.deleteEventById(createdEvent.id);

    expect(eventStore.getEvents()).not.toContainEqual(createdEvent);
  });

  it('should throw when event is not found', () => {
    expect(() => eventStore.deleteEventById(1)).toThrow('Event Not found.');
  });
});

describe('eventStore.patchEventById testcases', () => {
  let eventStore: ReturnType<typeof createEventStore>;
  beforeEach(() => {
    eventStore = createEventStore();
  });
  it('should patch event by id which exists', () => {
    const createdEvent = eventStore.addEvent({
      type: 'page_view',
      url: 'https://www.example.com',
    });
    expect(eventStore.getEvents()).toContainEqual(createdEvent);
    expect(createdEvent.url).toBe('https://www.example.com');

    const patchedEvent = eventStore.patchEventById(createdEvent.id, {
      url: 'https://www.test.com',
    });
    expect(eventStore.getEventById(createdEvent.id)).toEqual(patchedEvent);
    expect(patchedEvent.id).toBe(createdEvent.id);
    expect(patchedEvent.url).toBe('https://www.test.com');
    expect(patchedEvent.updatedAt).toBeInstanceOf(Date);
  });

  it('should throw when event is not found', () => {
    expect(() => eventStore.patchEventById(1, {})).toThrow('Event Not found.');
  });
});

describe('eventStore.updateEventById testcases', () => {
  let eventStore: ReturnType<typeof createEventStore>;
  beforeEach(() => {
    eventStore = createEventStore();
  });
  it('should patch event by id which exists', () => {
    const createdEvent = eventStore.addEvent({
      type: 'page_view',
      url: 'https://www.example.com',
    });
    expect(eventStore.getEvents()).toContainEqual(createdEvent);
    expect(createdEvent.url).toBe('https://www.example.com');

    const updatedEvent = eventStore.updateEventById(createdEvent.id, {
      url: 'https://www.test.com',
      type: 'click',
    });
    expect(eventStore.getEventById(createdEvent.id)).toEqual(updatedEvent);
    expect(updatedEvent.id).toBe(createdEvent.id);
    expect(updatedEvent.url).toBe('https://www.test.com');
    expect(updatedEvent.updatedAt).toBeInstanceOf(Date);
    expect(updatedEvent.type).toBe('click');
  });

  it('should throw when event is not found', () => {
    expect(() =>
      eventStore.updateEventById(1, { type: 'page_view', url: 'https://www.test.com' }),
    ).toThrow('Event Not found.');
  });
});
