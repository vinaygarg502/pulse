import { RouteContext } from '../types/router.js';

export const matchRoute = (
  routePathName: string,
  requestedPathName: string,
): RouteContext | undefined => {
  const routePathSplit = routePathName.split('/');
  const requestedPathSplit = requestedPathName.split('/');
  if (routePathSplit.length !== requestedPathSplit.length) {
    return;
  }
  const context: RouteContext = {};
  for (let i = 0; i < routePathSplit.length; i++) {
    const routePathParam = routePathSplit[i];
    const requestedPathParam = requestedPathSplit[i];
    if (routePathParam.startsWith(':')) {
      context[routePathParam.slice(1)] = requestedPathParam;
      continue;
    }
    if (routePathParam !== requestedPathParam) {
      return;
    }
  }
  return context;
};
