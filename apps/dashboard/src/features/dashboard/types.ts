export interface ApiEvent {
  type: string;
  url: string;
  createdAt: string;
  id: number;
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
export interface DashboardData {
  events: DashboardEvent[];
  metrics: DashboardMetric[];
}
