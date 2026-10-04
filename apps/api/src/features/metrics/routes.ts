import { ok } from '@/shared/utils/httpResponse.js';
import { withErrorHandler } from '@/shared/utils/withErrorHandler.js';
import { getMetricsData } from './store.js';
import { EventStore } from '../events/store.js';

export const createMetricsRoutes = (eventStore: EventStore) => {
  const getMetrics = withErrorHandler((req, res) => {
    const events = eventStore.getEvents();
    return ok(res, getMetricsData(events));
  });
  return { getMetrics };
};
