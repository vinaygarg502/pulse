import type { Metrics } from '../constants/metricTypes.js';
import { getEvents } from '../data/events.js';
import { ok } from '../utils/httpResponse.js';
import { withErrorHandler } from '../utils/withErrorHandler.js';

const getMetricsData = () => {
  const metrics: Metrics = {};
  const events = getEvents();
  for (const event of events) {
    const type = event.type;
    if (!(type in metrics)) {
      metrics[type] = 0;
    }
    metrics[type] += 1;
  }
  metrics.totalEvents = events.length;
  return metrics;
};

export const getMetrics = withErrorHandler((req, res) => {
  return ok(res, getMetricsData());
});
