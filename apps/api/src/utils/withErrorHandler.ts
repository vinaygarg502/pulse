import type { IncomingMessage, ServerResponse } from 'node:http';
import { BadRequestError } from '../errors/BadRequestError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { internalServerError, notFound, badRequest } from './httpResponse.js';

type RouteHandler = (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;

export const withErrorHandler = (handler: RouteHandler): RouteHandler => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      if (err instanceof BadRequestError) {
        badRequest(res, err.message);
        return;
      }
      if (err instanceof NotFoundError) {
        notFound(res, err.message);
        return;
      }
      if (err instanceof Error) {
        internalServerError(res, err.message);
        return;
      }

      internalServerError(res, 'Internal Server Error');
    }
  };
};
