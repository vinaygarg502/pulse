import { registerRoute } from './router.js';
import { HttpMethod } from '../types/http.js';
import {
  getEventsRoute,
  createEvent,
  updatedEventByIdRoute,
  updatePartialEventByIdRoute,
  deleteEventByIdRoute,
  getEventByIdRoute,
} from '@/features/events/routes.js';
import { healthHandler } from './../health/routes.js';
import { getMetrics } from '@/features/metrics/routes.js';
import { getLogs } from '@/features/logs/routes.js';
import { getSessions } from '@/features/sessions/routes.js';

registerRoute(HttpMethod.GET, '/events', getEventsRoute);
registerRoute(HttpMethod.POST, '/events', createEvent);
registerRoute(HttpMethod.PUT, '/events/:id', updatedEventByIdRoute);
registerRoute(HttpMethod.PATCH, '/events/:id', updatePartialEventByIdRoute);
registerRoute(HttpMethod.DELETE, '/events/:id', deleteEventByIdRoute);
registerRoute(HttpMethod.GET, '/events/:id', getEventByIdRoute);
registerRoute(HttpMethod.GET, '/metrics', getMetrics);
registerRoute(HttpMethod.GET, '/logs', getLogs);
registerRoute(HttpMethod.GET, '/sessions', getSessions);
registerRoute(HttpMethod.GET, '/health', healthHandler);
