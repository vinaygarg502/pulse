import app from '@/app.js';
import { registerRoutes } from '@/app/router/register.js';
import { router } from '@/app/router/router.js';
import { createEventStore } from '@/features/events/store.js';
import { beforeEach, describe, expect, it } from 'vitest';
describe('/sessions testcases', () => {
  beforeEach(() => {
    router.clear();
    const eventStore = createEventStore();
    registerRoutes(eventStore);
  });
  it('get /sessions should return 200 and sessions data', async () => {
    const req = {
      method: 'GET',
      url: '/sessions',
    };
    const res = {
      statusCode: 0,
      setHeader: () => {},
      end: (body?: string) => {
        const response = JSON.parse(body!);
        expect(res.statusCode).toBe(200);
        expect(response.data.length).toBe(5);
      },
      on: () => {},
    };
    await app(req as any, res as any);
  });
});
