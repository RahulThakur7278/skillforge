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

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">⚡</div>
        <div>
          <div className="sidebar-logo-text">SkillForge</div>
          <div className="sidebar-logo-sub">Career Intelligence</div>
        </div>
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
