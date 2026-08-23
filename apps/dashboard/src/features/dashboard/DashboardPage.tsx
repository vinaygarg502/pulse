import { useEffect, useState } from 'react';
import './dashboard.css';
import type { DashboardLog, DashboardEvent, DashboardMetric, DashboardSection } from './types';
import { fetchEvents, fetchLogs, fetchMetrics, getDashboardData } from './dashboard.repository';
import { SkeletonCard, SkeletonTable } from '@/components/skeleton';
import { ErrorState } from '@/components/error/ErrorState';
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

  const [loading, setLoading] = useState<boolean>(false);

  const fetchDashboardData = async (signal: AbortSignal) => {
    try {
      setLoading(true);
      const { events, metrics, logs } = await getDashboardData(signal);
      setEvents(events);
      setMetrics(metrics);
      setLogs(logs);
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
      return <div className="dashboard-card-info">No metrics available.</div>;
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
      return <div className="dashboard-card-info">No events available.</div>;
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
      return <div className="dashboard-card-info">No Logs Available</div>;
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
  return (
    <section className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>
      <section className="dashboard-card">
        <header className="dashboard-card-header">
          <h2>Recent Metrics</h2>
        </header>
        <div className="dashboard-card-content dashboard-metrics">
          {loading
            ? Array.from({ length: 4 }, (_, index) => <SkeletonCard key={index} />)
            : renderMetrics()}
        </div>
      </section>

      <section className="dashboard-card">
        <header className="dashboard-card-header">
          <h2>Recent Events</h2>
        </header>
        <div className="dashboard-card-content dashboard-events">
          {loading ? <SkeletonTable columns={4} rows={5} /> : renderEvents()}
        </div>
      </section>
      <section className="dashboard-card">
        <header className="dashboard-card-header">
          <h2>Recent Logs</h2>
        </header>
        <div className="dashboard-card-content dashboard-logs">
          {loading ? <SkeletonTable columns={4} rows={5} /> : renderLogs()}
        </div>
      </section>
    </section>
  );
};

export default DashboardPage;
