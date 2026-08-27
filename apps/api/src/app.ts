import type { IncomingMessage, ServerResponse } from 'node:http';
import { dispatch } from './app/router/disptacher.js';
const app = (req: IncomingMessage, res: ServerResponse) => {
  dispatch(req, res);
};
export default app;
