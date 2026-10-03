import { beforeEach, describe, expect, it, vi } from 'vitest';
import { router } from './router.js';
import { HttpMethod } from '../types/http.js';
import { findHandler } from './finder.js';
import { dispatch } from './disptacher.js';
import { logRequest } from '../middleware/logResponse.js';

vi.mock('./finder.js', () => ({
  findHandler: vi.fn(),
}));
vi.mock('@/features/logs/logger.js', () => ({
  logger: {
    info: vi.fn(),
  },
}));

vi.mock('../middleware/logResponse.js', () => ({
  logRequest: vi.fn(),
}));

describe('dispatch testcases', () => {
  beforeEach(() => {
    router.clear();
    vi.clearAllMocks();
  });
  it('should dispatch request to matched handler', async () => {
    const handler = vi.fn();
    const methodRoutes = new Map();
    router.set(HttpMethod.GET, methodRoutes);
    vi.mocked(findHandler).mockReturnValue({ handler, context: {} });
    const req = {
      method: 'GET',
      url: '/events',
    };
    const res = {
      on: vi.fn(),
      statusCode: 200,
    };
    await dispatch(req as any, res as any);
    expect(findHandler).toHaveBeenCalledWith(methodRoutes, '/events');
    expect(handler).toHaveBeenCalledWith(req, res, {});
  });
  it('should return 404 when request URL is missing', async () => {
    const req = {
      method: 'GET',
      url: undefined,
    };
    const res = {
      on: vi.fn(),
      statusCode: 200,
      setHeader: vi.fn(),
      end: vi.fn(),
    };
    await dispatch(req as any, res as any);
    expect(res.statusCode).toBe(404);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Route Not Found' }));
  });
  it('should return 404 when request url handler is missing', async () => {
    vi.mocked(findHandler).mockReturnValue(undefined);
    const methodRoutes = new Map();
    router.set(HttpMethod.GET, methodRoutes);
    const req = {
      method: 'GET',
      url: '/events',
    };
    const res = {
      on: vi.fn(),
      statusCode: 200,
      setHeader: vi.fn(),
      end: vi.fn(),
    };
    await dispatch(req as any, res as any);
    expect(findHandler).toHaveBeenCalledWith(methodRoutes, '/events');
    expect(res.statusCode).toBe(404);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Route Not Found' }));
  });
  it('should return 404 when method routes is missing', async () => {
    vi.mocked(findHandler).mockReturnValue(undefined);
    const methodRoutes = new Map();
    router.set(HttpMethod.GET, methodRoutes);
    const req = {
      method: 'POST',
      url: '/events',
    };
    const res = {
      on: vi.fn(),
      statusCode: 200,
      setHeader: vi.fn(),
      end: vi.fn(),
    };
    await dispatch(req as any, res as any);
    expect(res.statusCode).toBe(404);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Route Not Found' }));
    expect(findHandler).not.toHaveBeenCalled();
  });
  it('should log request when response finishes', async () => {
    const handler = vi.fn();
    const methodRoutes = new Map();
    router.set(HttpMethod.GET, methodRoutes);
    vi.mocked(findHandler).mockReturnValue({ handler, context: {} });
    const req = {
      method: 'GET',
      url: '/events',
    };
    let finishCallback: (() => void) | undefined;
    const res = {
      on: vi.fn((event, callback) => {
        if (event === 'finish') {
          finishCallback = callback;
        }
      }),
      statusCode: 200,
    };
    await dispatch(req as any, res as any);
    finishCallback?.();
    expect(res.statusCode).toBe(200);
    expect(logRequest).toHaveBeenCalledWith(200, expect.stringMatching(/^GET \/events - \d+ms$/), {
      duration: expect.any(Number),
    });
  });
  it('should not log request when response finishes for /logs', async () => {
    const handler = vi.fn();
    const methodRoutes = new Map();

    router.set(HttpMethod.GET, methodRoutes);

    vi.mocked(findHandler).mockReturnValue({
      handler,
      context: {},
    });

    const req = {
      method: 'GET',
      url: '/logs',
    };

    let finishCallback: (() => void) | undefined;

    const res = {
      on: vi.fn((event, callback) => {
        if (event === 'finish') {
          finishCallback = callback;
        }
      }),
      statusCode: 200,
    };

    await dispatch(req as any, res as any);

    finishCallback?.();

    expect(logRequest).not.toHaveBeenCalled();
  });
});
