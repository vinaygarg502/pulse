import { ok } from '@/shared/utils/httpResponse.js';
import { withErrorHandler } from '@/shared/utils/withErrorHandler.js';

export const healthHandler = withErrorHandler((req, res, context) => {
  ok(res, { status: 'ok' });
  return;
});
