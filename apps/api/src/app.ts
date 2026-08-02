import type { IncomingMessage, ServerResponse } from 'node:http';
import { dispatch } from './router/disptacher.js';
const app = (req: IncomingMessage, res: ServerResponse) => {
  console.log('😊 Chef received a customer!');

  dispatch(req, res);
};
export default app;
