import { ok } from '../utils/httpResponse.js';
import { withErrorHandler } from '../utils/withErrorHandler.js';
import { getLogsData } from '../logger/logs.js';

export const getLogs = withErrorHandler((req, res) => {
  ok(res, getLogsData());
});
