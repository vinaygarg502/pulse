import type { ServerResponse } from 'node:http';

export function badRequest(res: ServerResponse, message: string) {
  res.statusCode = 400;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: message }));
}
