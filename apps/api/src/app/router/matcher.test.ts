import { describe, it, expect } from 'vitest';
import { matchRoute } from './matcher.js';

describe('matchRoute testcases', () => {
  it('should match a static route', () => {
    const result = matchRoute('/events', '/events');
    expect(result).toEqual({});
  });
  it('should match a parameterized route', () => {
    const result = matchRoute('/events/:id', '/events/1');
    expect(result).toEqual({ id: '1' });
  });
  it('should return undefined when static route does not match', () => {
    const result = matchRoute('/events', '/metrics');

    expect(result).toBeUndefined();
  });

  it('should return undefined when path segment count is different', () => {
    const result = matchRoute('/events/:id', '/events/123/details');

    expect(result).toBeUndefined();
  });

  it('should extract multiple route parameters', () => {
    const result = matchRoute('/users/:userId/events/:eventId', '/users/10/events/20');

    expect(result).toEqual({
      userId: '10',
      eventId: '20',
    });
  });

  it('should return undefined when static segment does not match', () => {
    const result = matchRoute('/events/:id', '/metrics/123');

    expect(result).toBeUndefined();
  });
});
