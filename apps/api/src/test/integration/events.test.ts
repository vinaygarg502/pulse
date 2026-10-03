import { describe, expect, it } from 'vitest';
import app from '@/app.js';
import '@/app/router/register.js';

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
});
