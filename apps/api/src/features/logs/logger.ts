import { addLog } from './store.js';
import { Log, LogLevel } from './types.js';

let nextLogId = 1;

const createLog = (level: LogLevel, message: string, configuration: Record<string, number>) => {
  const timeStamp = new Date();
  const { duration } = configuration || {};
  return {
    id: nextLogId++,
    level,
    message,
    createdAt: timeStamp,
    ...(duration !== undefined ? { duration } : {}),
  };
};

const printLog = (log: Log) => {
  const { createdAt, level, message } = log;
  console.log(`[${createdAt.toISOString()}] [${level}] ${message}`);
};

const writeLog = (level: LogLevel, message: string, configuration: Record<string, number>) => {
  const logEntry: Log = createLog(level, message, configuration);
  addLog(logEntry);
  printLog(logEntry);
};
export const logger = {
  info(message: string, configuration: Record<string, number> = {}) {
    writeLog(LogLevel.INFO, message, configuration);
  },
  warn(message: string, configuration: Record<string, number> = {}) {
    writeLog(LogLevel.WARN, message, configuration);
  },
  error(message: string, configuration: Record<string, number> = {}) {
    writeLog(LogLevel.ERROR, message, configuration);
  },
};
