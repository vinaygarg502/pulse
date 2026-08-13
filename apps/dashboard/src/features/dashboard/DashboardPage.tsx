import { useEffect, useState } from 'react';
import './dashboard.css';
import type { DashboardEvent } from './types';
import { getDashboardEvents } from './dashboard.repository';
const DashboardPage = () => {
  const [events, setEvents] = useState<DashboardEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await getDashboardEvents();
        setEvents(events);
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
        <div className="metric-card">
          <h3 className="metric-title">Requests</h3>
          <p className="metric-value">1,24,567</p>
          <span className="metric-change"> +12% today</span>
        </div>
        <div className="metric-card">
          <h3 className="metric-title">Errors</h3>
          <p className="metric-value">21</p>
          <span className="metric-change"> -8% today</span>
        </div>
        <div className="metric-card">
          <h3 className="metric-title">Latency</h3>
          <p className="metric-value">145 ms</p>
          <span className="metric-change"> -12 ms today</span>
        </div>
        <div className="metric-card">
          <h3 className="metric-title">Availability</h3>
          <p className="metric-value">99.98%</p>
          <span className="metric-change"> +0.02%</span>
        </div>
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
