import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  addEvent,
  deleteEventById,
  getEventById,
  getEvents,
  patchEventById,
  updateEventById,
  validateEvent,
  validatePatchEvent,
} from '../data/events.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { withErrorHandler } from '../utils/withErrorHandler.js';
import { created, noContent, ok } from '../utils/httpResponse.js';

const reqBody = (req: IncomingMessage): Promise<string> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    req.on('end', () => {
      const bodyBuffer = Buffer.concat(chunks);
      const body = bodyBuffer.toString();
      resolve(body);
    });
    req.on('error', reject);
  });
};

export const createEvent = withErrorHandler(async (req: IncomingMessage, res: ServerResponse) => {
  const body = await reqBody(req);
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    throw new BadRequestError('Invalid JSON payload');
  }
  const eventInput = validateEvent(payload);
  const updatedEvent = addEvent(eventInput);
  created(res, updatedEvent);
});

export const getEventsRoute = withErrorHandler((req, res, context) => {
  ok(res, getEvents());
});

export const getEventByIdRoute = withErrorHandler((req, res, context) => {
  const id = Number(context?.id);
  if (Number.isNaN(id)) {
    throw new BadRequestError('Invalid Id');
  }
  const event = getEventById(id);
  ok(res, event);
});

export const deleteEventByIdRoute = withErrorHandler((req, res, context) => {
  const id = Number(context?.id);
  if (Number.isNaN(id)) {
    throw new BadRequestError('Invalid Id');
  }
  deleteEventById(id);
  noContent(res);
});
export const updatedEventByIdRoute = withErrorHandler(async (req, res, context) => {
  const id = Number(context?.id);
  if (Number.isNaN(id)) {
    throw new BadRequestError('Invalid Id');
  }

  const body = await reqBody(req);
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    throw new BadRequestError('Invalid JSON payload');
  }
  const eventInput = validateEvent(payload);
  const updatedEvent = updateEventById(id, eventInput);
  ok(res, updatedEvent);
});
export const updatePartialEventByIdRoute = withErrorHandler(async (req, res, context) => {
  const id = Number(context?.id);
  if (Number.isNaN(id)) {
    throw new BadRequestError('Invalid Id');
  }

  const body = await reqBody(req);
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    throw new BadRequestError('Invalid JSON payload');
  }
  const eventInput = validatePatchEvent(payload);
  const updatedEvent = patchEventById(id, eventInput);
  ok(res, updatedEvent);
});
