import type { IncomingMessage, ServerResponse } from 'node:http';
import router from './router.js';
const app = (req: IncomingMessage, res: ServerResponse) => {
  console.log('😊 Chef received a customer!');

  router(req, res);
};
export default app;
