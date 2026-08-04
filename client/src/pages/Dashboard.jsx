import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { Loader, ErrorState, Badge } from '../components/common';
import { analyticsApi, skillsApi } from '../services/api';
import { formatSalary } from '../utils/constants';
import { useApi } from '../hooks/useApi';

export default function Dashboard() {
  const { data, loading, error, refetch } = useApi(() => analyticsApi.dashboard());
  const { data: influenceData } = useApi(() => skillsApi.influence(10));
  const { data: bridgeData } = useApi(() => skillsApi.bridges());

  if (loading) return <Layout title="Dashboard"><Loader text="Loading dashboard…" /></Layout>;
  if (error) return <Layout title="Dashboard"><ErrorState message={error} onRetry={refetch} /></Layout>;

  const { metrics, domains, topSkills, salary } = data || {};

  return (
    <Layout title="Dashboard">
      {/* Metrics */}
      <div className="dashboard-metrics stagger">
        <MetricCard icon="⚡" value={metrics?.skills} label="Skills" color="var(--purple)" />
        <MetricCard icon="👔" value={metrics?.roles} label="Roles" color="var(--blue)" />
        <MetricCard icon="🌐" value={metrics?.domains} label="Domains" color="var(--teal)" />
        <MetricCard icon="📚" value={metrics?.resources} label="Resources" color="var(--amber)" />
        <MetricCard icon="👥" value={metrics?.professionals} label="Professionals" color="var(--pink)" />
        <MetricCard icon="🔗" value={metrics?.relationships} label="Relationships" color="var(--cyan)" />
      </div>

      <div className="dashboard-grid">
        {/* Top Required Skills */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">🔥 Most In-Demand Skills</h2>
            <p className="section-subtitle">Skills required by the most roles</p>
          </div>
          {topSkills?.map((skill, i) => (
            <div className="dashboard-list-item" key={skill.name}>
              <div className="dashboard-list-item-left">
                <span className="dashboard-rank">{i + 1}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{skill.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{skill.domain}</div>
                </div>
              </div>
              <Badge variant="purple">{skill.demand} roles</Badge>
            </div>
          ))}
        </div>

        {/* Domain Distribution */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">🌐 Domain Distribution</h2>
            <p className="section-subtitle">Skills per domain</p>
          </div>
          {domains?.map((d) => (
            <div className="dashboard-list-item" key={d.name}>
              <div className="dashboard-list-item-left">
                <span style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: d.color, display: 'inline-block', flexShrink: 0
                }} />
                <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{d.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div className="progress-bar" style={{ width: 100 }}>
                  <div className="progress-bar-fill" style={{
                    width: `${(d.skillCount / (domains[0]?.skillCount || 1)) * 100}%`,
                    background: d.color,
                  }} />
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', minWidth: 24, textAlign: 'right' }}>
                  {d.skillCount}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Skill Influence */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">🏆 Most Influential Skills</h2>
            <p className="section-subtitle">Skills that unlock the most downstream skills (graph metric)</p>
          </div>
          {influenceData?.map((skill, i) => (
            <div className="dashboard-list-item" key={skill.name}>
              <div className="dashboard-list-item-left">
                <span className="dashboard-rank">{i + 1}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{skill.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{skill.domain}</div>
                </div>
              </div>
              <Badge variant="teal">Unlocks {skill.influence}</Badge>
            </div>
          ))}
        </div>

        {/* Salary by Level */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">💰 Salary by Level</h2>
            <p className="section-subtitle">Average compensation per career level</p>
          </div>
          {salary?.map((s) => (
            <div className="dashboard-list-item" key={s.level}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', textTransform: 'capitalize' }}>{s.level}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{s.roleCount} roles</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="career-salary">{formatSalary(s.avgSalary)}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  {formatSalary(s.minSalary)} – {formatSalary(s.maxSalary)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bridge Skills */}
        {bridgeData?.length > 0 && (
          <div className="card dashboard-grid-full">
            <div className="section-header">
              <h2 className="section-title">🌉 Cross-Domain Bridge Skills</h2>
              <p className="section-subtitle">Skills that connect multiple domains — uniquely powerful for career flexibility</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              {bridgeData.map((b) => (
                <div key={b.name} className="chip selected" style={{ cursor: 'default' }}>
                  <span>{b.name}</span>
                  <span style={{ fontSize: 'var(--text-xs)', opacity: 0.7 }}>→ {b.domains?.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function MetricCard({ icon, value, label, color }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!value) return;
    const duration = 1200;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayed(value);
        clearInterval(timer);
      } else {
        setDisplayed(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="card metric-card card-interactive card-glow">
      <span className="metric-icon">{icon}</span>
      <div className="metric-value gradient-text" style={{ '--gradient-start': color }}>
        {displayed?.toLocaleString()}
      </div>
      <div className="metric-label">{label}</div>
    </div>
  );
}
