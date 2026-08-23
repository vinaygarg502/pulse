export interface ApiEvent {
  type: string;
  url: string;
  createdAt: string;
  id: number;
}

export const LOG_LEVEL = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  WARN: 'WARN',
} as const;

export type LogLevel = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL];
export interface ApiLog {
  level: LogLevel;
  message: string;
  createdAt: string;
  id: number;
  duration?: number;
}
export interface ApiMetrics {
  [key: string]: number;
}
export interface ApiMetric {
  type: string;
  value: number;
}
export interface DashboardMetric {
  type: string;
  title: string;
  value: number;
}
export interface DashboardEvent {
  eventType: string;
  eventUrl: string;
  time: string;
  id: number;
}

export interface DashboardLog {
  id: number;
  time: string;
  level: LogLevel;
  message: string;
  duration?: number;
  levelVariant: string;
}
export interface DashboardData {
  events: DashboardEvent[];
  metrics: DashboardMetric[];
  logs: DashboardLog[];
}
