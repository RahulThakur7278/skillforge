export function Loader({ text = 'Loading…' }) {
  return (
    <div className="loader-wrapper" id="loader">
      <div className="loader-spinner" />
      <span className="loader-text">{text}</span>
    </div>
  );
}

export function SkeletonCard({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-text" style={{ width: '80%' }} />
          <div className="skeleton skeleton-text" style={{ width: '60%' }} />
        </div>
      ))}
    </>
  );
}

export function EmptyState({ icon = '📭', title = 'No data found', description = '' }) {
  return (
    <div className="empty-state" id="empty-state">
      <span className="empty-state-icon">{icon}</span>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="error-state" id="error-state">
      <span className="error-state-icon">⚠️</span>
      <h3 className="error-state-title">Error</h3>
      <p className="error-state-message">{message}</p>
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

export function Difficulty({ level = 1 }) {
  return (
    <div className="difficulty" title={`Difficulty: ${level}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`difficulty-dot ${i <= level ? 'active' : ''}`} />
      ))}
    </div>
  );
}

export function Badge({ children, variant = 'gray' }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

export function SearchInput({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <div className={`input-wrapper search-input ${className}`}>
      <span className="input-icon">🔍</span>
      <input
        type="text"
        className="input input-with-icon"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        id="search-input"
      />
    </div>
  );
}
