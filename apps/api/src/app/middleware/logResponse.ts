import { logger } from '@/features/logs/logger.js';

export const logRequest = (
  statusCode: number,
  message: string,
  configuration: Record<string, number>,
) => {
  if (statusCode >= 500) {
    logger.error(message, configuration);
  } else if (statusCode >= 400) {
    logger.warn(message, configuration);
  } else {
    logger.info(message, configuration);
  }
};
