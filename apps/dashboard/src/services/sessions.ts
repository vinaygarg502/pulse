import { config } from '@/config/env';

export const getSessions = async (signal: AbortSignal) => {
  const response = await fetch(`${config.API_URL}/sessions`, { signal });
  const sessions = await response.json();
  return sessions.data;
};
