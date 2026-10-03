import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  badRequest,
  created,
  internalServerError,
  noContent,
  notFound,
  ok,
} from './httpResponse.js';
import { mockResponse } from '@/test/mockResponse.js';

describe('ok', () => {
  let res: ReturnType<typeof mockResponse>;
  beforeEach(() => {
    res = mockResponse();
  });
  it('should return 200 with data', () => {
    ok(res as any, { name: 'PULSE' });
    expect(res.statusCode).toBe(200);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ data: { name: 'PULSE' } }));
  });
});

describe('badRequest', () => {
  let res: ReturnType<typeof mockResponse>;
  beforeEach(() => {
    res = mockResponse();
  });
  it('should return 400 with error', () => {
    badRequest(res as any, 'Invalid Request');
    expect(res.statusCode).toBe(400);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Invalid Request' }));
  });
});

describe('InternalServerError', () => {
  let res: ReturnType<typeof mockResponse>;
  beforeEach(() => {
    res = mockResponse();
  });
  it('should return 500 with error', () => {
    internalServerError(res as any, 'Something Went Wrong');
    expect(res.statusCode).toBe(500);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Something Went Wrong' }));
  });
});

describe('NotFound', () => {
  let res: ReturnType<typeof mockResponse>;
  beforeEach(() => {
    res = mockResponse();
  });
  it('should return 404 with error', () => {
    notFound(res as any, 'Event Not Found');
    expect(res.statusCode).toBe(404);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Event Not Found' }));
  });
});

describe('created', () => {
  let res: ReturnType<typeof mockResponse>;
  beforeEach(() => {
    res = mockResponse();
  });
  it('should return 201 with created data', () => {
    created(res as any, { name: 'Created' });
    expect(res.statusCode).toBe(201);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ data: { name: 'Created' } }));
  });
});
describe('nocontent', () => {
  let res: ReturnType<typeof mockResponse>;
  beforeEach(() => {
    res = mockResponse();
  });
  it('should return 204 with no data', () => {
    noContent(res as any);
    expect(res.statusCode).toBe(204);
    expect(res.end).toHaveBeenCalled();
  });
});
