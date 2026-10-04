import app from '@/app.js';
import { registerRoutes } from '@/app/router/register.js';
import { router } from '@/app/router/router.js';
import { createEventStore } from '@/features/events/store.js';
import { beforeEach, describe, expect, it } from 'vitest';

describe('invalid url testcases', () => {
  beforeEach(() => {
    router.clear();
    const eventStore = createEventStore();
    registerRoutes(eventStore);
  });
  it('404 not found testcases', async () => {
    const req = {
      method: 'GET',
      url: '/invalid-url',
    };
    const res = {
      statusCode: 0,
      setHeader: () => {},
      end: (body?: string) => {
        expect(res.statusCode).toBe(404);
        expect(body).toBe(JSON.stringify({ error: 'Route Not Found' }));
      },
    };
    await app(req as any, res as any);
  });
});
