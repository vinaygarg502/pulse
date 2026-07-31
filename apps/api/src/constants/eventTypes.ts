export type AllowedEventType = 'page_view' | 'click' | 'purchase';
export const allowedEventTypes = new Set<AllowedEventType>(['page_view', 'click', 'purchase']);
