interface EmptyStateProps {
  message: string;
}

import './empty-state.css';

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="dashboard-empty">
      <div className="dashboard-info">{message}</div>
    </div>
  );
};
