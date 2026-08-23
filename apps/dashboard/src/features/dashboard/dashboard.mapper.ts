import { formatTime } from '@/utils/date';
import type {
  ApiEvent,
  ApiLog,
  ApiMetric,
  ApiMetrics,
  DashboardData,
  DashboardEvent,
  DashboardLog,
  DashboardMetric,
  LogLevel,
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

const levelVariants: Record<LogLevel, string> = {
  INFO: 'badge-success',
  WARN: 'badge-warning',
  ERROR: 'badge-error',
};

export const eventMapper = (event: ApiEvent): DashboardEvent => {
  return {
    id: event.id,
    time: formatTime(event.createdAt),
    eventUrl: event.url,
    eventType: event.type,
  };
};
export const logMapper = (log: ApiLog): DashboardLog => {
  return {
    id: log.id,
    time: formatTime(log.createdAt),
    level: log.level,
    message: log.message,
    levelVariant: levelVariants[log.level],
    ...(log.duration !== undefined ? { duration: log.duration } : {}),
  };
};
export const metricMapper = (metric: ApiMetric): DashboardMetric => {
  return {
    type: metric.type,
    title: metricTitles[metric.type] ?? metric.type,
    value: metric.value,
  };
};
export const toDashboardData = (
  events: ApiEvent[],
  metrics: ApiMetrics,
  logs: ApiLog[],
): DashboardData => {
  const mappedEvents = events.map(eventMapper);
  const mappedLogs = logs.map(logMapper);
  const mappedMetrics = Object.entries(metrics)
    .sort((a, b) => metricOrder[a[0]] - metricOrder[b[0]])
    .map(([key, value]) => metricMapper({ type: key, value: Number(value) }));
  return {
    events: mappedEvents,
    metrics: mappedMetrics,
    logs: mappedLogs,
  };
};
