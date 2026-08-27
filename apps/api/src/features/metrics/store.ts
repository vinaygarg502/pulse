import type { Metrics } from './types.js';
import { getEvents } from '../events/store.js';

export const getMetricsData = () => {
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
