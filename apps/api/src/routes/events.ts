import type { IncomingMessage, ServerResponse } from 'node:http';
import { badRequest } from '../utils/badRequest.js';
import { addEvent, fetchId, getEventById, getEvents } from '../data/events.js';
import { notFound } from '../utils/notFound.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

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
      const updatedEvent = addEvent(event);
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ data: updatedEvent }));
    } catch (err) {
      if (err instanceof BadRequestError) {
        badRequest(res, err.message);
        return;
      }

      badRequest(res, 'Unknown error');
    }
  });
};

export const getEventsRoute = (res: ServerResponse) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ data: getEvents() }));
};

export const getEventByIdRoute = (req: IncomingMessage, res: ServerResponse) => {
  try {
    const id = fetchId(req.url);
    if (Number.isNaN(id)) {
      throw new BadRequestError('Invalid Id');
    }
    const event = getEventById(id);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ data: event }));
  } catch (err) {
    if (err instanceof BadRequestError) {
      badRequest(res, err.message);
      return;
    }
    if (err instanceof NotFoundError) {
      notFound(res, err.message);
    }
  }
};
