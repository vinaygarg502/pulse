import { vi } from 'vitest';

export const mockResponse = () => {
  return {
    statusCode: 0,
    end: vi.fn(),
    setHeader: vi.fn(),
  };
};
