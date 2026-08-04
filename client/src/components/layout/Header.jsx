import { useEffect, useState } from 'react';
import { healthApi } from '../../services/api';

export default function Header({ title }) {
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
      <h1 className="header-title">{title}</h1>
      <div className="header-actions">
        <div className="header-status">
          <span className={`status-dot ${dbStatus}`} />
          <span>
            CognoDB {dbStatus === 'connected' ? 'Connected' : dbStatus === 'loading' ? 'Connecting…' : 'Offline'}
          </span>
        </div>
      </div>
    </header>
  );
}
