import { config } from '@/config/env';

export const getMetricsData = async () => {
  const response = await fetch(`${config.API_URL}/metrics`);
  const metrics = await response.json();
  return metrics.data;
};
