export enum LogLevel {
  INFO = 'INFO',
  ERROR = 'ERROR',
  WARN = 'WARN',
}
export type Log = {
  id: number;
  level: LogLevel;
  message: string;
  createdAt: Date;
  duration?: number;
};
