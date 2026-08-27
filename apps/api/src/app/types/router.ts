import type { IncomingMessage, ServerResponse } from 'node:http';
import { HttpMethod } from './http.js';

export type RouteContext = Record<string, string>;
export type RouteHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  context?: RouteContext,
) => void | Promise<void>;
export type MethodRoutes = Map<string, RouteHandler>;
export type RouteTable = Map<HttpMethod, MethodRoutes>;

export type RouteMatch = { handler: RouteHandler; context: RouteContext };
