import './dashboard-card.css';
import type { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  contentClassName?: string;
}
export const DashboardCard = ({ title, children, contentClassName }: DashboardCardProps) => {
  return (
    <section className="dashboard-card">
      <header className="dashboard-card-header">
        <h2>{title}</h2>
      </header>
      <div className={`dashboard-card-content ${contentClassName ?? ''}`}>{children}</div>
    </section>
  );
};
