import { withErrorHandler } from '@/shared/utils/withErrorHandler.js';
import { getSessionsData } from './store.js';
import { ok } from '@/shared/utils/httpResponse.js';

export const getSessions = withErrorHandler((req, res) => {
  return ok(res, getSessionsData());
});
