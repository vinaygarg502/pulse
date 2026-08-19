import type {
  ApiEvent,
  ApiMetric,
  ApiMetrics,
  DashboardData,
  DashboardEvent,
  DashboardMetric,
} from './types';

const metricTitles: Record<string, string> = {
  page_view: 'Page View',
  click: 'Click',
  purchase: 'Purchase',
  totalEvents: 'Total Events',
};

const metricOrder: Record<string, number> = {
  totalEvents: 0,
  page_view: 1,
  click: 2,
  purchase: 3,
};

export const eventMapper = (event: ApiEvent): DashboardEvent => {
  return {
    id: event.id,
    time: event.createdAt,
    eventUrl: event.url,
    eventType: event.type,
  };
};
export const metricMapper = (metric: ApiMetric): DashboardMetric => {
  return {
    type: metric.type,
    title: metricTitles[metric.type] ?? metric.type,
    value: metric.value,
  };
};
export const toDashboardData = (events: ApiEvent[], metrics: ApiMetrics): DashboardData => {
  const mappedEvents = events.map(eventMapper);
  const mappedMetrics = Object.entries(metrics)
    .sort((a, b) => metricOrder[a[0]] - metricOrder[b[0]])
    .map(([key, value]) => metricMapper({ type: key, value: Number(value) }));
  return {
    events: mappedEvents,
    metrics: mappedMetrics,
  };
};
