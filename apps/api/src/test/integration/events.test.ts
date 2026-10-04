import { beforeEach, describe, expect, it, vi } from 'vitest';
import app from '@/app.js';
import { router } from '@/app/router/router.js';
import { createEventStore } from '@/features/events/store.js';
import { registerRoutes } from '@/app/router/register.js';
beforeEach(() => {
  router.clear();
  const eventStore = createEventStore();
  registerRoutes(eventStore);
});

describe('Events integration', () => {
  it('should return events through the complete application pipeline', async () => {
    const req = {
      method: 'GET',
      url: '/events',
    };

    const res = {
      statusCode: 0,
      setHeader: () => {},
      end: (body?: string) => {
        expect(res.statusCode).toBe(200);
        expect(body).toBe(JSON.stringify({ data: [] }));
      },
      on: () => {},
    };

    await app(req as any, res as any);
  });

  it('should create event through the complete application pipeline', async () => {
    const req = {
      method: 'POST',
      url: '/events',
      on: vi.fn((event, callback) => {
        if (event === 'data') {
          callback(
            Buffer.from(JSON.stringify({ type: 'page_view', url: 'https:www.example.com' })),
          );
        }
        if (event === 'end') {
          callback();
        }
      }),
    };

    const res = {
      statusCode: 0,
      setHeader: () => {},
      end: (body?: string) => {
        const response = JSON.parse(body!);
        expect(res.statusCode).toBe(201);

        expect(response.data).toMatchObject({ type: 'page_view', url: 'https:www.example.com' });
        expect(response.data.id).toEqual(expect.any(Number));
      },
      on: () => {},
    };

    await app(req as any, res as any);
  });

  it('should return 400 when JSON is invalid through the complete application pipeline', async () => {
    const req = {
      method: 'POST',
      url: '/events',
      on: vi.fn((event, callback) => {
        if (event === 'data') {
          callback(Buffer.from('{invalid json}'));
        }
        if (event === 'end') {
          callback();
        }
      }),
    };

    const res = {
      statusCode: 0,
      setHeader: () => {},
      end: (body?: string) => {
        const response = JSON.parse(body!);
        expect(res.statusCode).toBe(400);

        expect(response.error).toBe('Invalid JSON payload');
      },
      on: () => {},
    };

    await app(req as any, res as any);
  });

  it('should return 400 when event payload is invalid', async () => {
    const req = {
      method: 'POST',
      url: '/events',
      on: vi.fn((event, callback) => {
        if (event === 'data') {
          callback(
            Buffer.from(JSON.stringify({ type: 'invalid_type', url: 'https:www.example.com' })),
          );
        }
        if (event === 'end') {
          callback();
        }
      }),
    };

    const res = {
      statusCode: 0,
      setHeader: () => {},
      end: (body?: string) => {
        const response = JSON.parse(body!);
        expect(res.statusCode).toBe(400);

        expect(response.error).toBe('Invalid Event Type');
      },
      on: () => {},
    };

    await app(req as any, res as any);
  });
  it('should return an existing event by id', async () => {
    let eventId: number | undefined;

    const createReq = {
      method: 'POST',
      url: '/events',
      on: vi.fn((event, callback) => {
        if (event === 'data') {
          callback(
            Buffer.from(
              JSON.stringify({
                type: 'page_view',
                url: 'https://example.com',
              }),
            ),
          );
        }

        if (event === 'end') {
          callback();
        }
      }),
    };

    const createRes = {
      statusCode: 0,
      setHeader: () => {},
      end: (body?: string) => {
        const response = JSON.parse(body!);
        eventId = response.data.id;
      },
      on: () => {},
    };

    await app(createReq as any, createRes as any);

    const getReq = {
      method: 'GET',
      url: `/events/${eventId}`,
    };

    const getRes = {
      statusCode: 0,
      setHeader: () => {},
      end: (body?: string) => {
        const response = JSON.parse(body!);

        expect(getRes.statusCode).toBe(200);
        expect(response.data).toMatchObject({
          id: eventId,
          type: 'page_view',
          url: 'https://example.com',
        });
      },
      on: () => {},
    };

    await app(getReq as any, getRes as any);
  });
  it('should return 404 when event does not exist', async () => {
    const req = {
      method: 'GET',
      url: '/events/999999',
    };

    const res = {
      statusCode: 0,
      setHeader: () => {},
      end: (body?: string) => {
        const response = JSON.parse(body!);

        expect(res.statusCode).toBe(404);
        expect(response.error).toBe('Event Not Found');
      },
      on: () => {},
    };

    await app(req as any, res as any);
  });
  it('should partially update an existing event', async () => {
    let eventId: number | undefined;

    // Create event
    const createReq = {
      method: 'POST',
      url: '/events',
      on: vi.fn((event, callback) => {
        if (event === 'data') {
          callback(
            Buffer.from(
              JSON.stringify({
                type: 'page_view',
                url: 'https://example.com',
              }),
            ),
          );
        }

        if (event === 'end') {
          callback();
        }
      }),
    };

    const createRes = {
      statusCode: 0,
      setHeader: () => {},
      end: (body?: string) => {
        const response = JSON.parse(body!);
        eventId = response.data.id;
      },
      on: () => {},
    };

    await app(createReq as any, createRes as any);

    // Patch event
    const patchReq = {
      method: 'PATCH',
      url: `/events/${eventId}`,
      on: vi.fn((event, callback) => {
        if (event === 'data') {
          callback(
            Buffer.from(
              JSON.stringify({
                url: 'https://updated.example.com',
              }),
            ),
          );
        }

        if (event === 'end') {
          callback();
        }
      }),
    };

    const patchRes = {
      statusCode: 0,
      setHeader: () => {},
      end: (body?: string) => {
        const response = JSON.parse(body!);

        expect(patchRes.statusCode).toBe(200);
        expect(response.data).toMatchObject({
          id: eventId,
          type: 'page_view',
          url: 'https://updated.example.com',
        });
      },
      on: () => {},
    };

    await app(patchReq as any, patchRes as any);
  });
  it('should fully update an existing event', async () => {
    let eventId: number | undefined;

    // Create event
    const createReq = {
      method: 'POST',
      url: '/events',
      on: vi.fn((event, callback) => {
        if (event === 'data') {
          callback(
            Buffer.from(
              JSON.stringify({
                type: 'page_view',
                url: 'https://example.com',
              }),
            ),
          );
        }

        if (event === 'end') {
          callback();
        }
      }),
    };

    const createRes = {
      statusCode: 0,
      setHeader: () => {},
      end: (body?: string) => {
        const response = JSON.parse(body!);
        eventId = response.data.id;
      },
      on: () => {},
    };

    await app(createReq as any, createRes as any);

    // Patch event
    const deleteReq = {
      method: 'PUT',
      url: `/events/${eventId}`,
      on: vi.fn((event, callback) => {
        if (event === 'data') {
          callback(
            Buffer.from(
              JSON.stringify({
                url: 'https://updated.example.com',
                type: 'purchase',
              }),
            ),
          );
        }

        if (event === 'end') {
          callback();
        }
      }),
    };

    const patchRes = {
      statusCode: 0,
      setHeader: () => {},
      end: (body?: string) => {
        const response = JSON.parse(body!);

        expect(patchRes.statusCode).toBe(200);
        expect(response.data).toMatchObject({
          id: eventId,
          type: 'purchase',
          url: 'https://updated.example.com',
        });
      },
      on: () => {},
    };

    await app(deleteReq as any, patchRes as any);
  });
  it('should delete an existing event', async () => {
    let eventId: number | undefined;

    // Create event
    const createReq = {
      method: 'POST',
      url: '/events',
      on: vi.fn((event, callback) => {
        if (event === 'data') {
          callback(
            Buffer.from(
              JSON.stringify({
                type: 'page_view',
                url: 'https://example.com',
              }),
            ),
          );
        }

        if (event === 'end') {
          callback();
        }
      }),
    };

    const createRes = {
      statusCode: 0,
      setHeader: () => {},
      end: (body?: string) => {
        const response = JSON.parse(body!);
        eventId = response.data.id;
      },
      on: () => {},
    };

    await app(createReq as any, createRes as any);

    // Patch event
    const deleteReq = {
      method: 'DELETE',
      url: `/events/${eventId}`,
    };

    const patchRes = {
      statusCode: 0,
      setHeader: () => {},
      end: () => {
        expect(patchRes.statusCode).toBe(204);
      },
      on: () => {},
    };

    await app(deleteReq as any, patchRes as any);
  });
});
