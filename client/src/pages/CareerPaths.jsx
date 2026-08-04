import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Loader, ErrorState, EmptyState, Badge } from '../components/common';
import { rolesApi } from '../services/api';
import { useApi } from '../hooks/useApi';
import { formatSalary } from '../utils/constants';

export default function CareerPaths() {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedRoleDetail, setSelectedRoleDetail] = useState(null);

  const { data: roles, loading: rolesLoading, error: rolesError, refetch } =
    useApi(() => rolesApi.list({ limit: 100 }));

  const { data: careerPaths, loading: pathsLoading } = useApi(
    () => rolesApi.careerPaths(selectedRole),
    [selectedRole],
    { enabled: !!selectedRole }
  );

  const { data: roleDetail, loading: detailLoading } = useApi(
    () => rolesApi.get(selectedRoleDetail),
    [selectedRoleDetail],
    { enabled: !!selectedRoleDetail }
  );

  if (rolesLoading) return <Layout title="Career Paths"><Loader text="Loading roles…" /></Layout>;
  if (rolesError) return <Layout title="Career Paths"><ErrorState message={rolesError} onRetry={refetch} /></Layout>;

  // Group roles by level
  const grouped = {};
  roles?.forEach((r) => {
    if (!grouped[r.level]) grouped[r.level] = [];
    grouped[r.level].push(r);
  });

  const levelOrder = ['junior', 'mid', 'senior', 'lead'];

  return (
    <Layout title="Career Paths">
      <div className="section-header">
        <h2 className="section-title gradient-text">🚀 Career Progression Paths</h2>
        <p className="section-subtitle">
          Select a starting role to explore multi-hop career progressions through the graph
        </p>
      </div>

      {/* Role Selector */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Starting Role:</label>
        <select
          className="select"
          value={selectedRole}
          onChange={(e) => { setSelectedRole(e.target.value); setSelectedRoleDetail(null); }}
          id="role-selector"
        >
          <option value="">Choose a role…</option>
          {levelOrder.map((level) =>
            grouped[level]?.map((r) => (
              <option key={r.title} value={r.title}>
                {r.title} ({formatSalary(r.avg_salary)})
              </option>
            ))
          )}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: roleDetail ? '1fr 400px' : '1fr', gap: 'var(--space-6)' }}>
        {/* Career Path Tree */}
        <div>
          {!selectedRole ? (
            <EmptyState
              icon="🚀"
              title="Choose a starting role"
              description="Select a role from the dropdown to explore possible career progressions"
            />
          ) : pathsLoading ? (
            <Loader text="Traversing career graph…" />
          ) : !careerPaths?.length ? (
            <EmptyState
              icon="🏁"
              title="End of the line!"
              description={`"${selectedRole}" doesn't have any forward career paths in the graph. Try a more junior role.`}
            />
          ) : (
            <div className="card">
              <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-4)' }}>
                Career paths from <span className="gradient-text">{selectedRole}</span>
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>
                Found {careerPaths.length} progression paths ({Math.max(...careerPaths.map((p) => p.depth))} max hops)
              </p>
              <div className="career-path-tree stagger">
                {careerPaths.map((path, idx) => (
                  <div key={idx} style={{ marginBottom: 'var(--space-6)' }}>
                    {path.steps.map((step, sIdx) => (
                      <div className="career-path-step" key={`${idx}-${sIdx}`}>
                        <div className="career-path-connector">
                          <div
                            className="career-path-dot"
                            style={sIdx === 0 ? { background: 'var(--teal)', boxShadow: '0 0 10px rgba(20,184,166,0.5)' } : {}}
                          />
                          {sIdx < path.steps.length - 1 && <div className="career-path-line" />}
                        </div>
                        <div
                          className="card career-path-card card-interactive"
                          onClick={() => setSelectedRoleDetail(step.title)}
                          style={{ padding: 'var(--space-3) var(--space-4)' }}
                        >
                          <div className="career-path-role">{step.title}</div>
                          <div className="career-path-meta">
                            <Badge variant={
                              step.level === 'junior' ? 'green' :
                              step.level === 'mid' ? 'blue' :
                              step.level === 'senior' ? 'purple' : 'amber'
                            }>
                              {step.level}
                            </Badge>
                            <span className="career-salary">{formatSalary(step.avg_salary)}</span>
                            <span>{step.domain}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role Detail Sidebar */}
        {selectedRoleDetail && (
          <div className="card animate-fade-in" style={{ alignSelf: 'start', position: 'sticky', top: 'calc(var(--header-height) + var(--space-8))' }}>
            {detailLoading ? (
              <Loader text="Loading role…" />
            ) : roleDetail ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-4)' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-1)' }}>{roleDetail.title}</h3>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                      <Badge variant="blue">{roleDetail.level}</Badge>
                      <span className="career-salary">{formatSalary(roleDetail.avg_salary)}</span>
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedRoleDetail(null)}>✕</button>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                  {roleDetail.description}
                </p>

                {roleDetail.required_skills?.length > 0 && (
                  <>
                    <div className="skill-detail-section-title">Required Skills</div>
                    {roleDetail.required_skills.map((s) => (
                      <div className="dashboard-list-item" key={s.name} style={{ padding: 'var(--space-2) 0' }}>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{s.name}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{s.domain}</div>
                        </div>
                        <Badge variant={s.importance === 'core' ? 'purple' : s.importance === 'preferred' ? 'blue' : 'gray'}>
                          {s.importance}
                        </Badge>
                      </div>
                    ))}
                  </>
                )}

                <button
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: 'var(--space-4)', width: '100%' }}
                  onClick={() => { setSelectedRole(roleDetail.title); setSelectedRoleDetail(null); }}
                >
                  View Career Paths from This Role
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </Layout>
  );
}
