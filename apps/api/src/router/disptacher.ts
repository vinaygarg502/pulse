import type { IncomingMessage, ServerResponse } from 'node:http';
import { router } from './router.js';
import { HttpMethod } from '../types/http.js';
import { notFound } from '../utils/httpResponse.js';
import { findHandler } from './finder.js';
import { logger } from '../logger/logger.js';
import { logResponse } from './logResponse.js';

export const dispatch = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const method = req.method as HttpMethod;

  const url = req.url;

  if (!url) {
    notFound(res, 'Route Not Found');
    return;
  }
  const startTime = Date.now();
  const pathName = new URL(url, 'http://localhost').pathname;

  const methodRoutes = router.get(method);

  logger.info(`${method} ${pathName}`);

  if (!methodRoutes) {
    notFound(res, 'Route Not Found');
    return;
  }
  const routeMatch = findHandler(methodRoutes, pathName);

  if (!routeMatch?.handler) {
    notFound(res, 'Route Not Found');
    return;
  }
  res.on('finish', () => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    logResponse(res.statusCode, `${method} ${pathName} - ${duration}ms`);
  });
  await routeMatch.handler(req, res, routeMatch.context);
};
