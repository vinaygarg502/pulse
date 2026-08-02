import type { IncomingMessage, ServerResponse } from 'node:http';
import { BadRequestError } from '../errors/BadRequestError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { internalServerError, notFound, badRequest } from './httpResponse.js';
import { RouteHandler } from '../types/router.js';

export const withErrorHandler = (handler: RouteHandler): RouteHandler => {
  return async (req, res, context) => {
    try {
      await handler(req, res, context);
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
