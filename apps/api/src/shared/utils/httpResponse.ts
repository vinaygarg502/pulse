import type { ServerResponse } from 'node:http';

const sendJSON = (res: ServerResponse, statusCode: number, body: unknown) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(body));
};
export function badRequest(res: ServerResponse, message: string) {
  sendJSON(res, 400, { error: message });
}
export const internalServerError = (res: ServerResponse, message: string) => {
  sendJSON(res, 500, { error: message });
};
export const notFound = (res: ServerResponse, message: string) => {
  sendJSON(res, 404, { error: message });
};
export const ok = (res: ServerResponse, data: unknown) => {
  sendJSON(res, 200, { data });
};

export const created = (res: ServerResponse, data: unknown) => {
  sendJSON(res, 201, { data });
};
export const noContent = (res: ServerResponse) => {
  res.statusCode = 204;
  res.end();
};
