import type { IncomingMessage, ServerResponse } from 'node:http';
import { healthHandler } from './routes/health.js';
import { notFound } from './utils/notFound.js';
import { createEvent, getEvents } from './routes/events.js';

const Router = (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === 'GET' && req.url === '/health') {
    return healthHandler(req, res);
  } else if (req.method === 'POST' && req.url === '/events') {
    return createEvent(req, res);
  } else if (req.method === 'GET' && req.url === '/events') {
    return getEvents(res);
  }
  notFound(res);
};

export default Router;
