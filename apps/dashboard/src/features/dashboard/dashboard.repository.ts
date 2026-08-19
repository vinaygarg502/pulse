import { getEventsData } from '@/services/events';
import { toDashboardData } from './dashboard.mapper';
import { getMetricsData } from '@/services/metrics';

export const getDashboardData = async () => {
  const [events, metrics] = await Promise.all([getEventsData(), getMetricsData()]);
  return toDashboardData(events, metrics);
};
