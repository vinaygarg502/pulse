import { useEffect, useState } from 'react';
import './dashboard.css';
import type { DashboardEvent, DashboardMetric } from './types';
import { getDashboardData } from './dashboard.repository';
const DashboardPage = () => {
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { events, metrics } = await getDashboardData();
        setEvents(events);
        setMetrics(metrics);
        console.log(events, metrics);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEvents();
  }, []);
  return (
    <section className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>
      <section className="dashboard-metrics">
        {metrics.map((metric) => (
          <div className="metric-card">
            <h3 className="metric-title">{metric.title}</h3>
            <p className="metric-value">{metric.value}</p>
            <span className="metric-change"> +12% today</span>
          </div>
        ))}
      </section>
      <section className="dashboard-events">
        <header className="events-header">
          <h2>Recent Events</h2>
        </header>
        <div className="events-content">
          <table className="events-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Level</th>
                <th>Event</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.time}</td>
                  <td>{event.eventUrl}</td>
                  <td>{event.eventType}</td>
                  <td className="status-error">Open</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
};

export default DashboardPage;
