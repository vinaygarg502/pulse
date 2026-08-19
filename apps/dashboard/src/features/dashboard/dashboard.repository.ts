import { getEventsData } from '@/services/events';
import { toDashboardData } from './dashboard.mapper';
import { getMetricsData } from '@/services/metrics';

export const getDashboardData = async (signal: AbortSignal) => {
  const [events, metrics] = await Promise.all([getEventsData(signal), getMetricsData(signal)]);
  return toDashboardData(events, metrics);
};
