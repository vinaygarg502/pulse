import type { IncomingMessage, ServerResponse } from 'node:http';
import { router } from './router.js';
import { HttpMethod } from '../types/http.js';
import { notFound } from '../utils/httpResponse.js';
import { findHandler } from './finder.js';

export const dispatch = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const method = req.method as HttpMethod;

  const url = req.url;

  if (!url) {
    notFound(res, 'Route Not Found');
    return;
  }
  const pathName = new URL(url, 'http://localhost').pathname;

  const methodRoutes = router.get(method);

  if (!methodRoutes) {
    notFound(res, 'Route Not Found');
    return;
  }
  const routeMatch = findHandler(methodRoutes, pathName);

  if (!routeMatch?.handler) {
    notFound(res, 'Route Not Found');
    return;
  }
  await routeMatch.handler(req, res, routeMatch.context);
};
