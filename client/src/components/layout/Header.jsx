import { useEffect, useState } from 'react';
import { healthApi } from '../../services/api';

export default function Header({ title, toggleSidebar }) {
  const [dbStatus, setDbStatus] = useState('loading');

  useEffect(() => {
    let mounted = true;
    healthApi.check()
      .then(() => mounted && setDbStatus('connected'))
      .catch(() => mounted && setDbStatus('disconnected'));

    // Re-check every 30s
    const interval = setInterval(() => {
      healthApi.check()
        .then(() => mounted && setDbStatus('connected'))
        .catch(() => mounted && setDbStatus('disconnected'));
    }, 30000);

    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return (
    <header className="header" id="header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={toggleSidebar} aria-label="Toggle Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 className="header-title">{title}</h1>
      </div>
      <div className="header-actions">
        <div className="header-status">
          <span className={`status-dot ${dbStatus}`} />
          <span className="status-text">
            CognoDB {dbStatus === 'connected' ? 'Connected' : dbStatus === 'loading' ? 'Connecting…' : 'Offline'}
          </span>
        </div>
      </div>
    </header>
  );
}
