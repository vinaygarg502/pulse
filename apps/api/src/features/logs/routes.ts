import { ok } from '@/shared/utils/httpResponse.js';
import { withErrorHandler } from '@/shared/utils/withErrorHandler.js';
import { getLogsData } from './store.js';

export const getLogs = withErrorHandler((req, res) => {
  ok(res, getLogsData());
});
