export enum LogLevel {
  INFO = 'INFO',
  ERROR = 'ERROR',
  WARN = 'WARN',
}
const log = (level: LogLevel, message: string) => {
  const timeStamp = new Date().toISOString();
  console.log(`[${timeStamp}] [${level}] ${message}`);
};
export const logger = {
  info(message: string) {
    log(LogLevel.INFO, message);
  },
  warn(message: string) {
    log(LogLevel.WARN, message);
  },
  error(message: string) {
    log(LogLevel.ERROR, message);
  },
};
