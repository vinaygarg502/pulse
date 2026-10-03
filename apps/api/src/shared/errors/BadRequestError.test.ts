import { describe, expect, it } from 'vitest';
import { BadRequestError } from './BadRequestError.js';

describe('BadRequestError', () => {
  it('should create badRequestError with correct message and name', () => {
    const error = new BadRequestError('Invalid Request');

    expect(error).instanceOf(BadRequestError);
    expect(error).instanceOf(Error);
    expect(error.message).toBe('Invalid Request');
    expect(error.name).toBe('BadRequestError');
  });
});
