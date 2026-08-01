import type { IncomingMessage, ServerResponse } from 'node:http';
import { healthHandler } from './routes/health.js';
import { notFound } from './utils/httpResponse.js';
import {
  createEvent,
  deleteEventByIdRoute,
  getEventByIdRoute,
  getEventsRoute,
  updatedEventByIdRoute,
  updatePartialEventByIdRoute,
} from './routes/events.js';

const Router = (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === 'GET' && req.url === '/health') {
    return healthHandler(req, res);
  } else if (req.method === 'POST' && req.url === '/events') {
    return createEvent(req, res);
  } else if (req.method === 'GET' && req.url === '/events') {
    return getEventsRoute(res);
  } else if (req.method === 'GET' && req.url?.startsWith('/events/')) {
    return getEventByIdRoute(req, res);
  } else if (req.method === 'DELETE' && req.url?.startsWith('/events/')) {
    return deleteEventByIdRoute(req, res);
  } else if (req.method === 'PUT' && req.url?.startsWith('/events/')) {
    return updatedEventByIdRoute(req, res);
  } else if (req.method === 'PATCH' && req.url?.startsWith('/events/')) {
    return updatePartialEventByIdRoute(req, res);
  }
  notFound(res, 'Url not found');
};

export default Router;
