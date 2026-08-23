import './error.css';
interface ErrorStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ title, description, actionLabel, onRetry }: ErrorStateProps) => {
  return (
    <div className="error-state">
      <div className="error-icon">⚠️</div>

      <h3 className="error-title">{title}</h3>

      <p className="error-description">
        {description ?? 'Please try again. If the problem persists, check your network connection.'}
      </p>

      <button type="button" className="retry-button" onClick={onRetry}>
        {actionLabel ?? 'Retry'}
      </button>
    </div>
  );
};
