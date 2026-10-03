import { describe, expect, it, vi } from 'vitest';
import { healthHandler } from './routes.js';

describe('healthHandler', () => {
  it('should return health status', async () => {
    const req = {} as any;

    const res = {
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    };

    await healthHandler(req, res as any, {});

    expect(res.statusCode).toBe(200);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        data: {
          status: 'ok',
        },
      }),
    );
  });
});
