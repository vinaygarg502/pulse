import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerRoute, router } from './router.js';
import { HttpMethod } from '../types/http.js';

describe('registerRoute testcases', () => {
  beforeEach(() => {
    router.clear();
  });
  it('should register a route', () => {
    const handler = vi.fn();
    registerRoute(HttpMethod.GET, '/events', handler);
    expect(router.get(HttpMethod.GET)?.get('/events')).toBe(handler);
  });
  it('should register multiple routes for the same method', () => {
    const eventsHandler = vi.fn();
    const metricsHandler = vi.fn();

    registerRoute(HttpMethod.GET, '/events', eventsHandler);
    registerRoute(HttpMethod.GET, '/metrics', metricsHandler);

    const getRoutes = router.get(HttpMethod.GET);

    expect(getRoutes?.get('/events')).toBe(eventsHandler);
    expect(getRoutes?.get('/metrics')).toBe(metricsHandler);
  });
  it('should keep routes for different HTTP methods separate', () => {
    const getHandler = vi.fn();
    const postHandler = vi.fn();

    registerRoute(HttpMethod.GET, '/events', getHandler);
    registerRoute(HttpMethod.POST, '/events', postHandler);

    expect(router.get(HttpMethod.GET)?.get('/events')).toBe(getHandler);
    expect(router.get(HttpMethod.POST)?.get('/events')).toBe(postHandler);
  });
});
