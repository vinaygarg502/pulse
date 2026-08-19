import { useEffect, useState } from 'react';
import './dashboard.css';
import type { DashboardEvent, DashboardMetric } from './types';
import { getDashboardData } from './dashboard.repository';
const DashboardPage = () => {
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { events, metrics } = await getDashboardData(controller.signal);
        setEvents(events);
        setMetrics(metrics);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.log(err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
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
      return <div className="events-info">No events available.</div>;
    }
    return (
      <div className="events-content">
        <table className="events-table">
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
                <td className="status-error">Open</td>
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
      <section className="dashboard-events">
        <header className="events-header">
          <h2>Recent Events</h2>
        </header>
        {loading ? <p className="dashboard-loading">Loading events...</p> : renderEvents()}
      </section>
    </section>
  );
};

export default DashboardPage;
