import { ok } from '../utils/httpResponse.js';
import { withErrorHandler } from '../utils/withErrorHandler.js';

export const healthHandler = withErrorHandler((req, res, context) => {
  ok(res, { status: 'ok' });
  return;
});
