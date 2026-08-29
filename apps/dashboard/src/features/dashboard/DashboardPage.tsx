import { useEffect, useState } from 'react';
import './dashboard.css';
import type {
  DashboardLog,
  DashboardEvent,
  DashboardMetric,
  DashboardSection,
  DashboardSession,
} from './types';
import {
  fetchEvents,
  fetchLogs,
  fetchMetrics,
  fetchSessions,
  getDashboardData,
} from './dashboard.repository';
import { SkeletonCard, SkeletonTable } from '@/components/skeleton';
import { ErrorState } from '@/components/error/ErrorState';
import { DashboardCard } from '@/components/dashboard-card';
import { EmptyState } from '@/components/empty-state';

const DashboardPage = () => {
  const [events, setEvents] = useState<DashboardSection<DashboardEvent[]>>({
    data: [],
    error: null,
  });
  const [metrics, setMetrics] = useState<DashboardSection<DashboardMetric[]>>({
    data: [],
    error: null,
  });
  const [logs, setLogs] = useState<DashboardSection<DashboardLog[]>>({
    data: [],
    error: null,
  });
  const [sessions, setSessions] = useState<DashboardSection<DashboardSession[]>>({
    data: [],
    error: null,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const fetchDashboardData = async (signal: AbortSignal) => {
    try {
      setLoading(true);
      const { events, metrics, logs, sessions } = await getDashboardData(signal);
      setEvents(events);
      setMetrics(metrics);
      setLogs(logs);
      setSessions(sessions);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.log(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const retryEvents = async () => {
    const controller = new AbortController();
    setEvents(await fetchEvents(controller.signal));
  };

  const retryMetrics = async () => {
    const controller = new AbortController();
    setMetrics(await fetchMetrics(controller.signal));
  };

  const retryLogs = async () => {
    const controller = new AbortController();
    setLogs(await fetchLogs(controller.signal));
  };

  const retrySessions = async () => {
    const controller = new AbortController();
    setSessions(await fetchSessions(controller.signal));
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchDashboardData(controller.signal);
    return () => {
      controller.abort();
    };
  }, []);

  const renderMetrics = () => {
    if (metrics.error) {
      return <ErrorState title={'Unable to load metrics.'} onRetry={retryMetrics} />;
    }
    if (!metrics.data.length) {
      return <EmptyState message="No metrics available." />;
    }
    return metrics.data.map((metric) => (
      <div className="metric-card" key={metric.type}>
        <h3 className="metric-title">{metric.title}</h3>
        <p className="metric-value">{metric.value}</p>
        <span className="metric-change"> +12% today</span>
      </div>
    ));
  };

  const renderEvents = () => {
    if (events.error) {
      return <ErrorState title={'Unable to load events.'} onRetry={retryEvents} />;
    }
    if (!events.data.length) {
      return <EmptyState message="No Events available." />;
    }
    return (
      <table className="dashboard-card-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Event</th>
            <th>URL</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {events.data.map((event) => (
            <tr key={event.id}>
              <td>{event.time}</td>
              <td>{event.eventType}</td>
              <td>{event.eventUrl}</td>
              <td className="badge-error">Open</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  const renderLogs = () => {
    if (logs.error) {
      return <ErrorState title={'Unable to load logs.'} onRetry={retryLogs} />;
    }
    if (!logs.data.length) {
      return <EmptyState message="No Logs available." />;
    }
    return (
      <table className="dashboard-card-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Level</th>
            <th>Message</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {logs.data.map((log) => (
            <tr key={log.id}>
              <td>{log.time}</td>
              <td className={log.levelVariant}>{log.level}</td>
              <td>{log.message}</td>
              <td>{log.duration ?? '--'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  const renderSessions = () => {
    if (sessions.error) {
      return <ErrorState title={'Unable to load sessions.'} onRetry={retrySessions} />;
    }
    if (!sessions.data.length) {
      return <EmptyState message="No Sessions available." />;
    }
    return (
      <table className="dashboard-card-table">
        <thead>
          <tr>
            <th>Session Id</th>
            <th>Start Time</th>
            <th>Last Activity Time</th>
            <th>Duration</th>
            <th>Total Events</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sessions.data.map((session) => (
            <tr key={session.id}>
              <td>{session.id}</td>
              <td>{session.startedAt}</td>
              <td>{session.lastActivity}</td>
              <td>{session.duration ?? '--'}</td>
              <td>{session.eventCount}</td>
              <td className={`${session.status === 'ACTIVE' ? 'badge-success' : ''}`}>
                {session.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  return (
    <section className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>
      <DashboardCard title="Recent Metrics">
        <div className="dashboard-metrics">
          {loading
            ? Array.from({ length: 4 }, (_, index) => <SkeletonCard key={index} />)
            : renderMetrics()}
        </div>
      </DashboardCard>

      <DashboardCard title="Recent Events">
        {loading ? <SkeletonTable columns={4} rows={5} /> : renderEvents()}
      </DashboardCard>
      <DashboardCard title="Recent Logs">
        {loading ? <SkeletonTable columns={4} rows={5} /> : renderLogs()}
      </DashboardCard>
      <DashboardCard title="Recent Sessions">
        {loading ? <SkeletonTable columns={6} rows={5} /> : renderSessions()}
      </DashboardCard>
    </section>
  );
};

export default DashboardPage;
