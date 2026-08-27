import { ok } from '@/shared/utils/httpResponse.js';
import { withErrorHandler } from '@/shared/utils/withErrorHandler.js';
import { getMetricsData } from './store.js';

export const getMetrics = withErrorHandler((req, res) => {
  return ok(res, getMetricsData());
});
