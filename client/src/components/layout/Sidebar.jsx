import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { section: 'Explore', items: [
    { to: '/', icon: '📊', label: 'Dashboard' },
    { to: '/explorer', icon: '🕸️', label: 'Skill Explorer' },
    { to: '/careers', icon: '🚀', label: 'Career Paths' },
  ]},
  { section: 'Tools', items: [
    { to: '/skill-gap', icon: '🎯', label: 'Skill Gap Analyzer' },
    { to: '/learning', icon: '📚', label: 'Learning Hub' },
  ]},
];

export default function Sidebar({ isOpen, closeSidebar }) {
  const location = useLocation();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="sidebar-logo-icon">⚡</div>
          <div>
            <div className="sidebar-logo-text">SkillForge</div>
            <div className="sidebar-logo-sub">Career Intelligence</div>
          </div>
        </div>
        <button className="mobile-close-btn" onClick={closeSidebar} aria-label="Close Sidebar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((section) => (
          <div className="sidebar-section" key={section.section}>
            <div className="sidebar-section-title">{section.section}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-item ${isActive || (item.to === '/' && location.pathname === '/') ? 'active' : ''}`
                }
                end={item.to === '/'}
                onClick={closeSidebar}
              >
                <span className="nav-item-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>Powered by <a href="https://console.cognodb.com" target="_blank" rel="noopener noreferrer">CognoDB Cloud</a></p>
      </div>
    </aside>
  );
}
