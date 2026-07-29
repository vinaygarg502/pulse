import type { IncomingMessage, ServerResponse } from 'node:http';

export const healthHandler = (req: IncomingMessage, res: ServerResponse) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ status: 'ok' }));
  return;
};
