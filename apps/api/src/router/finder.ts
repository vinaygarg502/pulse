import { MethodRoutes, RouteMatch } from '../types/router.js';
import { matchRoute } from './matcher.js';

export const findHandler = (
  methodRoutes: MethodRoutes,
  requestedPathName: string,
): RouteMatch | undefined => {
  const handler = methodRoutes.get(requestedPathName);

  if (handler) {
    return {
      handler,
      context: {},
    };
  }
  for (const [routePathName, handler] of methodRoutes) {
    const context = matchRoute(routePathName, requestedPathName);

    if (context) {
      return {
        handler,
        context,
      };
    }
  }
  return undefined;
};
