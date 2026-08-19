import { config } from '@/config/env';

export const getMetricsData = async (signal: AbortSignal) => {
  const response = await fetch(`${config.API_URL}/metrics`, { signal });
  const metrics = await response.json();
  return metrics.data;
};
