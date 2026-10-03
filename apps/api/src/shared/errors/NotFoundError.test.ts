import { describe, expect, it } from 'vitest';
import { NotFoundError } from './NotFoundError.js';

describe('NotFoundError', () => {
  it('should create NotFoundError with correct message and name', () => {
    const error = new NotFoundError('Not Found');

    expect(error).instanceOf(NotFoundError);
    expect(error).instanceOf(Error);
    expect(error.message).toBe('Not Found');
    expect(error.name).toBe('NotFoundError');
  });
});
