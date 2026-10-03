import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BadRequestError } from '../errors/BadRequestError.js';
import { withErrorHandler } from './withErrorHandler.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { mockResponse } from '@/test/mockResponse.js';

describe('withErrorHandler', () => {
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    res = mockResponse();
  });
  it('should return 400 for BadRequestError', async () => {
    const handler = vi.fn().mockRejectedValue(new BadRequestError('Invalid Request'));

    const wrappedHandler = withErrorHandler(handler);
    await wrappedHandler({} as any, res as any);
    expect(res.statusCode).toBe(400);
    expect(res.end).toHaveBeenCalled();
  });
  it('should return 404 for NotFoundError', async () => {
    const handler = vi.fn().mockRejectedValue(new NotFoundError('Not Found'));

    const wrappedHandler = withErrorHandler(handler);
    await wrappedHandler({} as any, res as any);
    expect(res.statusCode).toBe(404);
    expect(res.end).toHaveBeenCalled();
  });
  it('should return 500 for generic error', async () => {
    const handler = vi.fn().mockRejectedValue(new Error('Something Went Wrong'));

    const wrappedHandler = withErrorHandler(handler);
    await wrappedHandler({} as any, res as any);

    expect(res.statusCode).toBe(500);
    expect(res.end).toHaveBeenCalled();
  });
  it('should return 500 for non-Error thrown value', async () => {
    const handler = vi.fn().mockRejectedValue('something went wrong');

    const wrappedHandler = withErrorHandler(handler);
    await wrappedHandler({} as any, res as any);
    expect(res.statusCode).toBe(500);
    expect(res.end).toHaveBeenCalled();
  });

  it('should call the handler when no error occurs', async () => {
    const handler = vi.fn().mockRejectedValue(undefined);

    const wrappedHandler = withErrorHandler(handler);
    await wrappedHandler({} as any, res as any);

    expect(handler).toHaveBeenCalled();
  });
});
