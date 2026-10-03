import { Log } from './types.js';

const logs: Log[] = [];

const addLog = (log: Log) => {
  logs.push(log);
};

const getLogsData = (): Log[] => {
  return [...logs];
};

export { addLog, getLogsData };
