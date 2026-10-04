import { registerRoute } from './router.js';
import { HttpMethod } from '../types/http.js';
import { createEventStore, type EventStore } from '@/features/events/store.js';
import { createEventRoutes } from '@/features/events/routes.js';
import { healthHandler } from './../health/routes.js';
import { createMetricsRoutes } from '@/features/metrics/routes.js';
import { getLogs } from '@/features/logs/routes.js';
import { getSessions } from '@/features/sessions/routes.js';

export const registerRoutes = (eventStore: EventStore) => {
  const eventRoutes = createEventRoutes(eventStore);
  const metricsRoutes = createMetricsRoutes(eventStore);

  registerRoute(HttpMethod.GET, '/events', eventRoutes.getEventsRoute);
  registerRoute(HttpMethod.POST, '/events', eventRoutes.createEvent);
  registerRoute(HttpMethod.PUT, '/events/:id', eventRoutes.updatedEventByIdRoute);
  registerRoute(HttpMethod.PATCH, '/events/:id', eventRoutes.updatePartialEventByIdRoute);
  registerRoute(HttpMethod.DELETE, '/events/:id', eventRoutes.deleteEventByIdRoute);
  registerRoute(HttpMethod.GET, '/events/:id', eventRoutes.getEventByIdRoute);

  registerRoute(HttpMethod.GET, '/metrics', metricsRoutes.getMetrics);
  registerRoute(HttpMethod.GET, '/logs', getLogs);
  registerRoute(HttpMethod.GET, '/sessions', getSessions);
  registerRoute(HttpMethod.GET, '/health', healthHandler);
};
registerRoutes(createEventStore());
