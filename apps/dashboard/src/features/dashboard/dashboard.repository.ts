import { getEventsData } from '@/services/events';
import {
  toDashboardEvents,
  toDashboardLogs,
  toDashboardMetrics,
  toDashboardSessions,
} from './dashboard.mapper';
import { getMetricsData } from '@/services/metrics';
import { getLogsData } from '@/services/logs';
import type {
  DashboardData,
  DashboardEvent,
  DashboardLog,
  DashboardMetric,
  DashboardSection,
  DashboardSession,
} from './types';
import { getSessions } from '@/services/sessions';

const loadDashboardSection = async <T, R>(
  request: Promise<T>,
  mapper: (data: T) => R,
  fallback: R,
): Promise<DashboardSection<R>> => {
  try {
    const data = await request;
    return {
      data: mapper(data),
      error: null,
    };
  } catch (error) {
    return {
      data: fallback,
      error: error instanceof Error ? error : new Error('Something went wrong'),
    };
  }
};

export const getDashboardData = async (signal: AbortSignal): Promise<DashboardData> => {
  const [events, metrics, logs, sessions] = await Promise.all([
    fetchEvents(signal),
    fetchMetrics(signal),
    fetchLogs(signal),
    fetchSessions(signal),
  ]);
  return {
    events,
    metrics,
    logs,
    sessions,
  };
};

export const fetchEvents = async (
  signal: AbortSignal,
): Promise<DashboardSection<DashboardEvent[]>> => {
  return loadDashboardSection(getEventsData(signal), toDashboardEvents, []);
};
export const fetchMetrics = async (
  signal: AbortSignal,
): Promise<DashboardSection<DashboardMetric[]>> => {
  return loadDashboardSection(getMetricsData(signal), toDashboardMetrics, []);
};
export const fetchLogs = async (signal: AbortSignal): Promise<DashboardSection<DashboardLog[]>> => {
  return loadDashboardSection(getLogsData(signal), toDashboardLogs, []);
};

export const fetchSessions = async (
  signal: AbortSignal,
): Promise<DashboardSection<DashboardSession[]>> => {
  return loadDashboardSection(getSessions(signal), toDashboardSessions, []);
};
