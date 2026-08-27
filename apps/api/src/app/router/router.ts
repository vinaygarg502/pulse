import { HttpMethod } from '../types/http.js';
import { RouteHandler, RouteTable } from '../types/router.js';

export const router: RouteTable = new Map();

export const registerRoute = (method: HttpMethod, path: string, handler: RouteHandler): void => {
  let methodRoutes = router.get(method);

  if (!methodRoutes) {
    methodRoutes = new Map();
    router.set(method, methodRoutes);
  }
  methodRoutes.set(path, handler);
};
