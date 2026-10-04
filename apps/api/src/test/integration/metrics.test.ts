import { describe, it, expect, beforeEach } from 'vitest';
import { router } from '@/app/router/router.js';
import { createEventStore } from '@/features/events/store.js';
import { registerRoutes } from '@/app/router/register.js';
import app from '@/app.js';

describe('metrics testcases', () => {
  beforeEach(() => {
    router.clear();
    const eventStore = createEventStore();
    registerRoutes(eventStore);
  });
  it('get metrics testcases', async () => {
    const req = {
      method: 'GET',
      url: '/metrics',
    };
    const res = {
      statusCode: 0,
      setHeader: () => {},
      end: (body?: string) => {
        expect(res.statusCode).toBe(200);
        expect(body).toBe(JSON.stringify({ data: { totalEvents: 0 } }));
      },
      on: () => {},
    };
    await app(req as any, res as any);
  });
});
