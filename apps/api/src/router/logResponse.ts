import { logger } from '../logger/logger.js';

export const logResponse = (statusCode: number, message: string) => {
  if (statusCode >= 500) {
    logger.error(message);
  } else if (statusCode >= 400) {
    logger.warn(message);
  } else {
    logger.info(message);
  }
};
