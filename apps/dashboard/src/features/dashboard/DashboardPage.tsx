import { useEffect, useState } from 'react';
import './dashboard.css';
import type { DashboardLog, DashboardEvent, DashboardMetric } from './types';
import { getDashboardData } from './dashboard.repository';
const DashboardPage = () => {
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [logs, setLogs] = useState<DashboardLog[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const { events, metrics, logs } = await getDashboardData(controller.signal);
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
    fetchDashboardData();
    return () => {
      controller.abort();
    };
  }, []);

  const renderMetrics = () => {
    if (!metrics.length) {
      return <div>No metrics available.</div>;
    }
    return metrics.map((metric) => (
      <div className="metric-card" key={metric.type}>
        <h3 className="metric-title">{metric.title}</h3>
        <p className="metric-value">{metric.value}</p>
        <span className="metric-change"> +12% today</span>
      </div>
    ));
  };

  const renderEvents = () => {
    if (!events.length) {
      return <div className="dashboard-card-info">No events available.</div>;
    }
    return (
      <div className="dashboard-card-content">
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
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.time}</td>
                <td>{event.eventType}</td>
                <td>{event.eventUrl}</td>
                <td className="badge-error">Open</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  const renderLogs = () => {
    if (!logs.length) {
      return <div className="dashboard-card-info">No Logs Available</div>;
    }
    return (
      <div className="dashboard-card-content">
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
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.time}</td>
                <td>{log.level}</td>
                <td className={log.levelVariant}>{log.message}</td>
                <td>{log.duration ? log.duration : '--'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  return (
    <section className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>
      {loading ? (
        <p className="dashboard-loading">Loading metrics...</p>
      ) : (
        <section className="dashboard-metrics">{renderMetrics()}</section>
      )}
      <section className="dashboard-card dashboard-events">
        <header className="dashboard-card-header">
          <h2>Recent Events</h2>
        </header>
        {loading ? <p className="dashboard-loading">Loading events...</p> : renderEvents()}
      </section>
      <section className="dashboard-card dashboard-logs">
        <header className="dashboard-card-header">
          <h2>Recent Logs</h2>
        </header>
        {loading ? <p className="dashboard-loading">Loading logs...</p> : renderLogs()}
      </section>
    </section>
  );
};

export default DashboardPage;
