export type AllowedEventType = 'page_view' | 'click' | 'purchase';
export type AllowedKeys = 'type' | 'url';
export type EventInput = {
  type: AllowedEventType;
  url: string;
};
export const allowedEventTypes = new Set<AllowedEventType>(['page_view', 'click', 'purchase']);
export const allowedKeys = new Set<AllowedKeys>(['type', 'url']);
