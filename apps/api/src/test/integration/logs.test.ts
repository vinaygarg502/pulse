import app from '@/app.js';
import { registerRoutes } from '@/app/router/register.js';
import { router } from '@/app/router/router.js';
import { createEventStore, EventStore } from '@/features/events/store.js';
import { beforeEach, describe, expect, it } from 'vitest';

describe('logs testcases', () => {
  beforeEach(() => {
    router.clear();
    const eventStore: EventStore = createEventStore();
    registerRoutes(eventStore);
  });
  it('/logs testcase should return 200', async () => {
    const req = {
      method: 'GET',
      url: '/logs',
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
  it('get logs with data', async () => {
    const healthReq = {
      method: 'GET',
      url: '/health',
    };

    const healthRes = {
      statusCode: 0,
      setHeader: () => {},
      end: () => {},
      on: (event: string, callback: () => void) => {
        if (event === 'finish') {
          callback();
        }
      },
    };

    await app(healthReq as any, healthRes as any);

    const req = {
      method: 'GET',
      url: '/logs',
    };
    const res = {
      statusCode: 0,
      setHeader: () => {},
      end: (body?: string) => {
        expect(res.statusCode).toBe(200);

        const response = JSON.parse(body!);

        expect(response.data).toHaveLength(2);
        expect(response.data[0].message).toBe('GET /health');

        expect(response.data[1].message).toContain('GET /health -');
      },
      on: () => {},
    };
    await app(req as any, res as any);
  });
});
