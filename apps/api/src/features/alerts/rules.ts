import { AlertRule, AlertSeverity, AlertStatus } from './types.js';

export const rules: AlertRule[] = [
  {
    id: 'high-error-rate',
    title: 'High Error Rate',
    description: 'Error Count Exceeded Threshold',
    severity: AlertSeverity.HIGH,
  },
  {
    id: 'high-response-time',
    title: 'High Response Time',
    description: 'Average Response Time is too high.',
    severity: AlertSeverity.MEDIUM,
  },
  {
    id: 'no-active-sessions',
    title: 'No Active Sessions',
    description: 'No Active Users Detected.',
    severity: AlertSeverity.HIGH,
  },
];
