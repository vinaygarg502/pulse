import { describe, it, expect, vi } from 'vitest';
import { logRequest } from './logResponse.js';
import { logger } from '@/features/logs/logger.js';

vi.mock('@/features/logs/logger.js', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));
describe('logRequest', () => {
  it('should log error for 500 or higher status codes', () => {
    const configuration = { duration: 100 };

    logRequest(500, 'GET /events - 100ms', configuration);
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.info).not.toHaveBeenCalled();

    expect(logger.error).toHaveBeenCalledWith('GET /events - 100ms', configuration);
  });
  it('should log warning for 400 or higher status codes', () => {
    const configuration = { duration: 100 };

    logRequest(400, 'GET /events - 100ms', configuration);

    expect(logger.warn).toHaveBeenCalledWith('GET /events - 100ms', configuration);
  });

  it('should log info for less than 400', () => {
    const configuration = { duration: 100 };

    logRequest(200, 'GET /events - 100ms', configuration);

    expect(logger.info).toHaveBeenCalledWith('GET /events - 100ms', configuration);
  });
});
