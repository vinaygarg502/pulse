import { registerRoute } from './router.js';
import { HttpMethod } from '../types/http.js';
import {
  getEventsRoute,
  createEvent,
  updatedEventByIdRoute,
  updatePartialEventByIdRoute,
  deleteEventByIdRoute,
  getEventByIdRoute,
} from '../routes/events.js';
import { healthHandler } from '../routes/health.js';

registerRoute(HttpMethod.GET, '/events', getEventsRoute);
registerRoute(HttpMethod.POST, '/events', createEvent);
registerRoute(HttpMethod.PUT, '/events/:id', updatedEventByIdRoute);
registerRoute(HttpMethod.PATCH, '/events/:id', updatePartialEventByIdRoute);
registerRoute(HttpMethod.DELETE, '/events/:id', deleteEventByIdRoute);
registerRoute(HttpMethod.GET, '/events/:id', getEventByIdRoute);
registerRoute(HttpMethod.GET, '/health', healthHandler);
