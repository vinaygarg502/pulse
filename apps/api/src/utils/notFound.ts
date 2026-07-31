import type { ServerResponse } from 'node:http';

export const notFound = (res: ServerResponse, message: string) => {
  res.statusCode = 404;
  res.end(message);
};
