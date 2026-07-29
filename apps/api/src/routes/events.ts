import type { IncomingMessage, ServerResponse } from 'node:http';
import { badRequest } from '../utils/badRequest.js';

interface Event {
  type: string;
  url: string;
}

const allowedEventTypes = new Set(['page_view', 'click', 'purchase']);
const events: Event[] = [];

export const createEvent = (req: IncomingMessage, res: ServerResponse) => {
  const chunks: Buffer[] = [];
  req.on('data', (chunk) => {
    chunks.push(chunk);
  });
  req.on('end', () => {
    try {
      const bodyBuffer = Buffer.concat(chunks);
      const body = bodyBuffer.toString();
      const event = JSON.parse(body);

      if (!event.type) {
        badRequest(res, 'Type is required');
        return;
      }
      if (typeof event.type !== 'string') {
        badRequest(res, 'Type must be string');
        return;
      }
      if (!allowedEventTypes.has(event.type)) {
        badRequest(res, 'Invalid Event Type');
        return;
      }
      if (!event.url) {
        badRequest(res, 'Url is required');
        return;
      }
      if (typeof event.url !== 'string') {
        badRequest(res, 'Url must be string');
        return;
      }
      events.push(event);
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ data: event }));
    } catch {
      badRequest(res, 'Invalid JSON');
      return;
    }
  });
  return;
};

export const getEvents = (res: ServerResponse) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ data: events }));
  return;
};
