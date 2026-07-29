import type { ServerResponse } from 'node:http';

export const notFound = (res: ServerResponse) => {
  res.statusCode = 404;
  res.end('Route not found');
};
