export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}
export interface Session {
  id: string;
  startedAt: Date;
  lastActivity: Date;
  eventCount: number;
  status: SessionStatus;
}
