import { Session, SessionStatus } from './types.js';

const sessions: Session[] = [
  {
    id: 'sess_001',
    startedAt: new Date('2026-08-29T09:00:00Z'),
    lastActivity: new Date('2026-08-29T09:18:00Z'),
    eventCount: 18,
    status: SessionStatus.ACTIVE,
  },
  {
    id: 'sess_002',
    startedAt: new Date('2026-08-29T08:35:00Z'),
    lastActivity: new Date('2026-08-29T08:47:00Z'),
    eventCount: 11,
    status: SessionStatus.ENDED,
  },
  {
    id: 'sess_003',
    startedAt: new Date('2026-08-29T08:10:00Z'),
    lastActivity: new Date('2026-08-29T08:41:00Z'),
    eventCount: 27,
    status: SessionStatus.ACTIVE,
  },
  {
    id: 'sess_004',
    startedAt: new Date('2026-08-29T07:55:00Z'),
    lastActivity: new Date('2026-08-29T08:05:00Z'),
    eventCount: 6,
    status: SessionStatus.ENDED,
  },
  {
    id: 'sess_005',
    startedAt: new Date('2026-08-29T07:30:00Z'),
    lastActivity: new Date('2026-08-29T07:58:00Z'),
    eventCount: 22,
    status: SessionStatus.ENDED,
  },
];

export const addSession = (session: Session): void => {
  sessions.push(session);
};

export const getSessionsData = (): readonly Session[] => {
  return [...sessions];
};
