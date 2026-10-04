import app from '@/app.js';
import { registerRoutes } from '@/app/router/register.js';
import { router } from '@/app/router/router.js';
import { createEventStore, EventStore } from '@/features/events/store.js';
import { beforeEach, describe, expect, it } from 'vitest';

describe('get /health testcases', () => {
  beforeEach(() => {
    router.clear();
    const eventStore: EventStore = createEventStore();
    registerRoutes(eventStore);
  });
  it('get health testcases', async () => {
    const req = {
      method: 'GET',
      url: '/health',
    };
    const res = {
      statusCode: 0,
      setHeader: () => {},
      end: (body?: string) => {
        expect(res.statusCode).toBe(200);
        expect(body).toBe(JSON.stringify({ data: { status: 'ok' } }));
      },
      on: () => {},
    };
    await app(req as any, res as any);
  });
});
