import type { Event } from '../events/store.js';
import type { Metrics } from './types.js';

export const getMetricsData = (events: Event[]): Metrics => {
  const metrics: Metrics = {};
  for (const event of events) {
    const type = event.type;
    if (!(type in metrics)) {
      metrics[type] = 0;
    }
    metrics[type] += 1;
  }
  metrics.totalEvents = events.length;
  return { ...metrics };
};
