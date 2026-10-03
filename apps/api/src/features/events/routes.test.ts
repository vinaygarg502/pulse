import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  addEvent,
  deleteEventById,
  getEventById,
  getEvents,
  updateEventById,
  patchEventById,
} from './store.js';
import { mockResponse } from '@/test/mockResponse.js';
import {
  createEvent,
  deleteEventByIdRoute,
  getEventByIdRoute,
  getEventsRoute,
  updatedEventByIdRoute,
  updatePartialEventByIdRoute,
} from './routes.js';
import { NotFoundError } from '@/shared/errors/NotFoundError.js';

vi.mock('./store.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./store.js')>();
  return {
    ...actual,
    getEvents: vi.fn(),
    getEventById: vi.fn(),
    deleteEventById: vi.fn(),
    addEvent: vi.fn(),
    updateEventById: vi.fn(),
    patchEventById: vi.fn(),
  };
});

describe('getEventsRoute', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should return all the events', () => {
    const events = [
      {
        id: 1,
        type: 'page_view',
        url: 'https://example.com',
        createdAt: new Date(),
      },
    ];
    vi.mocked(getEvents).mockReturnValue(events);
    const res = mockResponse();
    getEventsRoute({} as any, res as any);

    expect(getEvents).toHaveBeenCalledOnce();
    expect(res.statusCode).toBe(200);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        data: events,
      }),
    );
  });
});

describe('getEventByIdRoute', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should return the event by id', () => {
    const event = {
      id: 1,
      type: 'page_view',
      url: 'https://example.com',
      createdAt: new Date(),
    };
    vi.mocked(getEventById).mockReturnValue(event);
    const res = mockResponse();
    getEventByIdRoute({} as any, res as any, { id: '1' });

    expect(getEventById).toHaveBeenCalledOnce();
    expect(res.statusCode).toBe(200);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        data: event,
      }),
    );
  });
  it('should return 400 if id is invalid', () => {
    const res = mockResponse();
    getEventByIdRoute({} as any, res as any, { id: 'abc' });
    expect(res.statusCode).toBe(400);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid Id',
      }),
    );
    expect(getEventById).not.toHaveBeenCalled();
  });
  it('should return 404 if event is not found', () => {
    vi.mocked(getEventById).mockImplementation(() => {
      throw new NotFoundError('Event Not Found');
    });
    const res = mockResponse();
    getEventByIdRoute({} as any, res as any, { id: '999' });
    expect(res.statusCode).toBe(404);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Event Not Found',
      }),
    );
  });
});
describe('deleteEventByIdRoute', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should delete event and return 204', () => {
    const res = mockResponse();
    deleteEventByIdRoute({} as any, res as any, { id: '1' });

    expect(deleteEventById).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(204);
    expect(res.end).toHaveBeenCalled();
  });
  it('should return 400 if id is invalid', () => {
    const res = mockResponse();
    deleteEventByIdRoute({} as any, res as any, { id: 'abc' });
    expect(res.statusCode).toBe(400);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid Id',
      }),
    );
    expect(deleteEventById).not.toHaveBeenCalled();
  });
  it('should return 404 if event is not found', () => {
    vi.mocked(deleteEventById).mockImplementation(() => {
      throw new NotFoundError('Event Not Found');
    });
    const res = mockResponse();
    deleteEventByIdRoute({} as any, res as any, { id: '999' });
    expect(deleteEventById).toHaveBeenCalledWith(999);
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
    vi.mocked(addEvent).mockReturnValue(event);
    const res = mockResponse();
    const req = mockRequest(
      JSON.stringify({
        type: 'page_view',
        url: 'https://example.com',
      }),
    );
    await createEvent(req as any, res as any);
    expect(addEvent).toHaveBeenCalledWith({
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
    await createEvent(req as any, res as any);

    expect(res.statusCode).toBe(400);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid JSON payload',
      }),
    );
    expect(addEvent).not.toHaveBeenCalled();
  });
  it('should create 400 when event payload is invalid', async () => {
    const res = mockResponse();
    const req = mockRequest(
      JSON.stringify({
        type: 'invalid_type',
        url: 'https://example.com',
      }),
    );
    await createEvent(req as any, res as any);

    expect(res.statusCode).toBe(400);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid Event Type',
      }),
    );
    expect(addEvent).not.toHaveBeenCalled();
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
    vi.mocked(updateEventById).mockReturnValue(event);
    const req = mockRequest(
      JSON.stringify({
        type: 'page_view',
        url: 'https://www.example.com',
      }),
    );
    const res = mockResponse();
    await updatedEventByIdRoute(req as any, res as any, { id: '1' });
    expect(updateEventById).toHaveBeenCalledWith(1, {
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
    await updatedEventByIdRoute(req as any, res as any, { id: 'abc' });

    expect(res.statusCode).toBe(400);

    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid Id',
      }),
    );
    expect(updateEventById).not.toHaveBeenCalled();
  });
  it('should return 400 if event input is invalid', async () => {
    const req = mockRequest(
      JSON.stringify({
        type: 'invalid_type',
        url: 'https://www.example.com',
      }),
    );
    const res = mockResponse();
    await updatedEventByIdRoute(req as any, res as any, { id: '1' });

    expect(res.statusCode).toBe(400);

    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid Event Type',
      }),
    );
    expect(updateEventById).not.toHaveBeenCalled();
  });

  it('should return 404 if event id is not found', async () => {
    vi.mocked(updateEventById).mockImplementation(() => {
      throw new NotFoundError('Event Not Found');
    });

    const req = mockRequest(
      JSON.stringify({
        type: 'page_view',
        url: 'https://www.example.com',
      }),
    );
    const res = mockResponse();
    await updatedEventByIdRoute(req as any, res as any, { id: '999' });
    expect(updateEventById).toHaveBeenCalledWith(999, {
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

    await updatedEventByIdRoute(req as any, res as any, { id: '1' });

    expect(res.statusCode).toBe(400);

    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid JSON payload',
      }),
    );

    expect(updateEventById).not.toHaveBeenCalled();
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
    vi.mocked(patchEventById).mockReturnValue(event);
    const req = mockRequest(
      JSON.stringify({
        url: 'https://www.example.com',
      }),
    );
    const res = mockResponse();
    await updatePartialEventByIdRoute(req as any, res as any, { id: '1' });
    expect(patchEventById).toHaveBeenCalledWith(1, {
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
    await updatePartialEventByIdRoute(req as any, res as any, { id: 'abc' });

    expect(res.statusCode).toBe(400);

    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid Id',
      }),
    );
    expect(patchEventById).not.toHaveBeenCalled();
  });
  it('should return 400 if event input is invalid', async () => {
    const req = mockRequest(
      JSON.stringify({
        type: 'invalid_type',
      }),
    );
    const res = mockResponse();
    await updatePartialEventByIdRoute(req as any, res as any, { id: '1' });

    expect(res.statusCode).toBe(400);

    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid Event Type',
      }),
    );
    expect(patchEventById).not.toHaveBeenCalled();
  });

  it('should return 404 if event id is not found', async () => {
    vi.mocked(patchEventById).mockImplementation(() => {
      throw new NotFoundError('Event Not Found');
    });

    const req = mockRequest(
      JSON.stringify({
        type: 'page_view',
        url: 'https://www.example.com',
      }),
    );
    const res = mockResponse();
    await updatePartialEventByIdRoute(req as any, res as any, { id: '999' });
    expect(patchEventById).toHaveBeenCalledWith(999, {
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

    await updatePartialEventByIdRoute(req as any, res as any, { id: '1' });

    expect(res.statusCode).toBe(400);

    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'Invalid JSON payload',
      }),
    );

    expect(patchEventById).not.toHaveBeenCalled();
  });
  it('should return 400 if patch payload is empty', async () => {
    const req = mockRequest(JSON.stringify({}));
    const res = mockResponse();

    await updatePartialEventByIdRoute(req as any, res as any, { id: '1' });

    expect(res.statusCode).toBe(400);

    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: 'At least one field must be present.',
      }),
    );

    expect(patchEventById).not.toHaveBeenCalled();
  });
});
