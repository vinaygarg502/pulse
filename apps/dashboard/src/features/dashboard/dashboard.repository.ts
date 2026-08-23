import { getEventsData } from '@/services/events';
import { toDashboardData } from './dashboard.mapper';
import { getMetricsData } from '@/services/metrics';
import { getLogsData } from '@/services/logs';

export const getDashboardData = async (signal: AbortSignal) => {
  const [events, metrics, logs] = await Promise.all([
    getEventsData(signal),
    getMetricsData(signal),
    getLogsData(signal),
  ]);
  return toDashboardData(events, metrics, logs);
};
