import { describe, it, expect, vi } from 'vitest';
import { findHandler } from './finder.js';

describe('findhandler testcases', () => {
  it('should return handler for exact route match', () => {
    const handler = vi.fn();
    const methodRoutes = new Map();
    methodRoutes.set('/events', handler);
    const result = findHandler(methodRoutes, '/events');
    expect(result).toEqual({ handler, context: {} });
  });
  it('should return handler and context for parameterized route', () => {
    const handler = vi.fn();
    const methodRoutes = new Map();
    methodRoutes.set('/events/:id', handler);
    const result = findHandler(methodRoutes, '/events/123');
    expect(result).toEqual({ handler, context: { id: '123' } });
  });
  it('should return undefined if route does not match', () => {
    const handler = vi.fn();
    const methodRoutes = new Map();
    methodRoutes.set('/events', handler);
    const result = findHandler(methodRoutes, '/metrics');
    expect(result).toBeUndefined();
  });
  it('should prefer exact route over parameterized route', () => {
    const exactHandler = vi.fn();
    const parameterizedHandler = vi.fn();

    const methodRoutes = new Map();

    methodRoutes.set('/events/:id', parameterizedHandler);
    methodRoutes.set('/events/list', exactHandler);

    const result = findHandler(methodRoutes, '/events/list');

    expect(result).toEqual({
      handler: exactHandler,
      context: {},
    });
  });
  it('should return undefined when no routes are registered', () => {
    const methodRoutes = new Map();

    const result = findHandler(methodRoutes, '/events');

    expect(result).toBeUndefined();
  });
});
