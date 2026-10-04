import type { IncomingMessage, ServerResponse } from 'node:http';
import type { EventStore } from './store.js';
import { validateEvent, validatePatchEvent } from './store.js';
import { BadRequestError } from '@/shared/errors/BadRequestError.js';
import { withErrorHandler } from '@/shared/utils/withErrorHandler.js';
import { created, noContent, ok } from '@/shared/utils/httpResponse.js';

const reqBody = (req: IncomingMessage): Promise<string> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
    req.on('error', reject);
  });
};

export const createEventRoutes = (store: EventStore) => ({
  createEvent: withErrorHandler(async (req: IncomingMessage, res: ServerResponse) => {
    const body = await reqBody(req);
    let payload: unknown;
    try {
      payload = JSON.parse(body);
    } catch {
      throw new BadRequestError('Invalid JSON payload');
    }

    const eventInput = validateEvent(payload);
    created(res, store.addEvent(eventInput));
  }),

  getEventsRoute: withErrorHandler((_req, res) => {
    ok(res, store.getEvents());
  }),

  getEventByIdRoute: withErrorHandler((_req, res, context) => {
    const id = Number(context?.id);
    if (Number.isNaN(id)) throw new BadRequestError('Invalid Id');
    ok(res, store.getEventById(id));
  }),

  deleteEventByIdRoute: withErrorHandler((_req, res, context) => {
    const id = Number(context?.id);
    if (Number.isNaN(id)) throw new BadRequestError('Invalid Id');
    store.deleteEventById(id);
    noContent(res);
  }),

  updatedEventByIdRoute: withErrorHandler(async (req, res, context) => {
    const id = Number(context?.id);
    if (Number.isNaN(id)) throw new BadRequestError('Invalid Id');

    const body = await reqBody(req);
    let payload: unknown;
    try {
      payload = JSON.parse(body);
    } catch {
      throw new BadRequestError('Invalid JSON payload');
    }

    const eventInput = validateEvent(payload);
    ok(res, store.updateEventById(id, eventInput));
  }),

  updatePartialEventByIdRoute: withErrorHandler(async (req, res, context) => {
    const id = Number(context?.id);
    if (Number.isNaN(id)) throw new BadRequestError('Invalid Id');

    const body = await reqBody(req);
    let payload: unknown;
    try {
      payload = JSON.parse(body);
    } catch {
      throw new BadRequestError('Invalid JSON payload');
    }

    const eventInput = validatePatchEvent(payload);
    ok(res, store.patchEventById(id, eventInput));
  }),
});
