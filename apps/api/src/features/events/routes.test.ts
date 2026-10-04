import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { EventStore } from './store.js';
import { mockResponse } from '@/test/mockResponse.js';
import { createEventRoutes } from './routes.js';
import { NotFoundError } from '@/shared/errors/NotFoundError.js';

let store: EventStore;
let routes: ReturnType<typeof createEventRoutes>;

beforeEach(() => {
  store = {
    addEvent: vi.fn(),
    getEvents: vi.fn(),
    getEventById: vi.fn(),
    deleteEventById: vi.fn(),
    patchEventById: vi.fn(),
    updateEventById: vi.fn(),
  };

  routes = createEventRoutes(store);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('getEventsRoute', () => {
  it('should return all the events', () => {
    const events = [
      {
        id: 1,
        type: 'page_view',
        url: 'https://example.com',
        createdAt: new Date(),
      },
    ];

    vi.mocked(store.getEvents).mockReturnValue(events);

    const res = mockResponse();
    routes.getEventsRoute({} as any, res as any);

    expect(store.getEvents).toHaveBeenCalledOnce();
    expect(res.statusCode).toBe(200);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        data: events,
      }),
    );
  });
});

describe('getEventByIdRoute', () => {
  it('should return the event by id', () => {
    const event = {
      id: 1,
      type: 'page_view',
      url: 'https://example.com',
      createdAt: new Date(),
    };

    vi.mocked(store.getEventById).mockReturnValue(event);

    const res = mockResponse();
    routes.getEventByIdRoute({} as any, res as any, { id: '1' });

    expect(store.getEventById).toHaveBeenCalledOnce();
    expect(res.statusCode).toBe(200);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        data: event,
      }),
    );
  });

  it('should return 400 if id is invalid', () => {
    const res = mockResponse();

    routes.getEventByIdRoute({} as any, res as any, { id: 'abc' });

    expect(res.statusCode).toBe(400);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid Id',
      }),
    );
    expect(store.getEventById).not.toHaveBeenCalled();
  });

  it('should return 404 if event is not found', () => {
    vi.mocked(store.getEventById).mockImplementation(() => {
      throw new NotFoundError('Event Not Found');
    });

    const res = mockResponse();
    routes.getEventByIdRoute({} as any, res as any, { id: '999' });

    expect(res.statusCode).toBe(404);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Event Not Found',
      }),
    );
  });
});

describe('deleteEventByIdRoute', () => {
  it('should delete event and return 204', () => {
    vi.mocked(store.deleteEventById).mockImplementation(() => undefined);

    const res = mockResponse();
    routes.deleteEventByIdRoute({} as any, res as any, { id: '1' });

    expect(store.deleteEventById).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(204);
    expect(res.end).toHaveBeenCalled();
  });

  it('should return 400 if id is invalid', () => {
    const res = mockResponse();

    routes.deleteEventByIdRoute({} as any, res as any, { id: 'abc' });

    expect(res.statusCode).toBe(400);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid Id',
      }),
    );
    expect(store.deleteEventById).not.toHaveBeenCalled();
  });

  it('should return 404 if event is not found', () => {
    vi.mocked(store.deleteEventById).mockImplementation(() => {
      throw new NotFoundError('Event Not Found');
    });

    const res = mockResponse();
    routes.deleteEventByIdRoute({} as any, res as any, { id: '999' });

    expect(store.deleteEventById).toHaveBeenCalledWith(999);
    expect(res.statusCode).toBe(404);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Event Not Found',
      }),
    );
  });
});

const mockRequest = (body: string) => ({
  on: vi.fn((event, callback) => {
    if (event === 'data') {
      callback(Buffer.from(body));
    }

    if (event === 'end') {
      callback();
    }
  }),
});

describe('createEvent', () => {
  it('should create event and return 201', async () => {
    const event = {
      id: 1,
      type: 'page_view' as const,
      url: 'https://example.com',
      createdAt: new Date(),
    };

    vi.mocked(store.addEvent).mockReturnValue(event);

    const res = mockResponse();
    const req = mockRequest(
      JSON.stringify({
        type: 'page_view',
        url: 'https://example.com',
      }),
    );

    await routes.createEvent(req as any, res as any);

    expect(store.addEvent).toHaveBeenCalledWith({
      type: 'page_view',
      url: 'https://example.com',
    });
    expect(res.statusCode).toBe(201);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        data: event,
      }),
    );
  });

  it('should create 400 with invalid json payload', async () => {
    const res = mockResponse();
    const req = mockRequest('{invalid json payload}');

    await routes.createEvent(req as any, res as any);

    expect(res.statusCode).toBe(400);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid JSON payload',
      }),
    );
    expect(store.addEvent).not.toHaveBeenCalled();
  });

  it('should create 400 when event payload is invalid', async () => {
    const res = mockResponse();
    const req = mockRequest(
      JSON.stringify({
        type: 'invalid_type',
        url: 'https://example.com',
      }),
    );

    await routes.createEvent(req as any, res as any);

    expect(res.statusCode).toBe(400);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid Event Type',
      }),
    );
    expect(store.addEvent).not.toHaveBeenCalled();
  });
});

describe('updateEventByIdRoute', () => {
  it('should return 200 and updated event if input is valid', async () => {
    const event = {
      id: 1,
      type: 'page_view' as const,
      url: 'https://www.example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(store.updateEventById).mockReturnValue(event);

    const req = mockRequest(
      JSON.stringify({
        type: 'page_view',
        url: 'https://www.example.com',
      }),
    );
    const res = mockResponse();

    await routes.updatedEventByIdRoute(req as any, res as any, { id: '1' });

    expect(store.updateEventById).toHaveBeenCalledWith(1, {
      type: 'page_view',
      url: 'https://www.example.com',
    });
    expect(res.statusCode).toBe(200);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        data: event,
      }),
    );
  });

  it('should return 400 if id is invalid', async () => {
    const req = mockRequest(
      JSON.stringify({
        type: 'page_view',
        url: 'https://www.example.com',
      }),
    );
    const res = mockResponse();

    await routes.updatedEventByIdRoute(req as any, res as any, { id: 'abc' });

    expect(res.statusCode).toBe(400);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid Id',
      }),
    );
    expect(store.updateEventById).not.toHaveBeenCalled();
  });

  it('should return 400 if event input is invalid', async () => {
    const req = mockRequest(
      JSON.stringify({
        type: 'invalid_type',
        url: 'https://www.example.com',
      }),
    );
    const res = mockResponse();

    await routes.updatedEventByIdRoute(req as any, res as any, { id: '1' });

    expect(res.statusCode).toBe(400);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid Event Type',
      }),
    );
    expect(store.updateEventById).not.toHaveBeenCalled();
  });

  it('should return 404 if event id is not found', async () => {
    vi.mocked(store.updateEventById).mockImplementation(() => {
      throw new NotFoundError('Event Not Found');
    });

    const req = mockRequest(
      JSON.stringify({
        type: 'page_view',
        url: 'https://www.example.com',
      }),
    );
    const res = mockResponse();

    await routes.updatedEventByIdRoute(req as any, res as any, { id: '999' });

    expect(store.updateEventById).toHaveBeenCalledWith(999, {
      type: 'page_view',
      url: 'https://www.example.com',
    });
    expect(res.statusCode).toBe(404);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Event Not Found',
      }),
    );
  });

  it('should return 400 if JSON payload is invalid', async () => {
    const req = mockRequest('{invalid-json}');
    const res = mockResponse();

    await routes.updatedEventByIdRoute(req as any, res as any, { id: '1' });

    expect(res.statusCode).toBe(400);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid JSON payload',
      }),
    );
    expect(store.updateEventById).not.toHaveBeenCalled();
  });
});

describe('updatePartialEventByIdRoute', () => {
  it('should return 200 and updated event if input is valid', async () => {
    const event = {
      id: 1,
      type: 'page_view' as const,
      url: 'https://www.example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(store.patchEventById).mockReturnValue(event);

    const req = mockRequest(
      JSON.stringify({
        url: 'https://www.example.com',
      }),
    );
    const res = mockResponse();

    await routes.updatePartialEventByIdRoute(req as any, res as any, { id: '1' });

    expect(store.patchEventById).toHaveBeenCalledWith(1, {
      url: 'https://www.example.com',
    });
    expect(res.statusCode).toBe(200);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        data: event,
      }),
    );
  });

  it('should return 400 if id is invalid', async () => {
    const req = mockRequest(
      JSON.stringify({
        url: 'https://www.example.com',
      }),
    );
    const res = mockResponse();

    await routes.updatePartialEventByIdRoute(req as any, res as any, { id: 'abc' });

    expect(res.statusCode).toBe(400);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid Id',
      }),
    );
    expect(store.patchEventById).not.toHaveBeenCalled();
  });

  it('should return 400 if event input is invalid', async () => {
    const req = mockRequest(
      JSON.stringify({
        type: 'invalid_type',
      }),
    );
    const res = mockResponse();

    await routes.updatePartialEventByIdRoute(req as any, res as any, { id: '1' });

    expect(res.statusCode).toBe(400);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid Event Type',
      }),
    );
    expect(store.patchEventById).not.toHaveBeenCalled();
  });

  it('should return 404 if event id is not found', async () => {
    vi.mocked(store.patchEventById).mockImplementation(() => {
      throw new NotFoundError('Event Not Found');
    });

    const req = mockRequest(
      JSON.stringify({
        type: 'page_view',
        url: 'https://www.example.com',
      }),
    );
    const res = mockResponse();

    await routes.updatePartialEventByIdRoute(req as any, res as any, { id: '999' });

    expect(store.patchEventById).toHaveBeenCalledWith(999, {
      type: 'page_view',
      url: 'https://www.example.com',
    });
    expect(res.statusCode).toBe(404);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Event Not Found',
      }),
    );
  });

  it('should return 400 if JSON payload is invalid', async () => {
    const req = mockRequest('{invalid-json}');
    const res = mockResponse();

    await routes.updatePartialEventByIdRoute(req as any, res as any, { id: '1' });

    expect(res.statusCode).toBe(400);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid JSON payload',
      }),
    );
    expect(store.patchEventById).not.toHaveBeenCalled();
  });

  it('should return 400 if patch payload is empty', async () => {
    const req = mockRequest(JSON.stringify({}));
    const res = mockResponse();

    await routes.updatePartialEventByIdRoute(req as any, res as any, { id: '1' });

    expect(res.statusCode).toBe(400);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'At least one field must be present.',
      }),
    );
    expect(store.patchEventById).not.toHaveBeenCalled();
  });
});
