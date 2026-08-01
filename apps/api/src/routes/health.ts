import type { IncomingMessage, ServerResponse } from 'node:http';
import { ok } from '../utils/httpResponse.js';

export const healthHandler = (req: IncomingMessage, res: ServerResponse) => {
  ok(res, { status: 'ok' });
  return;
};
