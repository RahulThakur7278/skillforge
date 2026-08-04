import { useState, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import { Loader, ErrorState, EmptyState, Badge, Difficulty } from '../components/common';
import { graphApi, skillsApi, rolesApi } from '../services/api';
import { useApi } from '../hooks/useApi';

export default function SkillGap() {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [targetRole, setTargetRole] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  const { data: allSkills, loading: skillsLoading } = useApi(() => skillsApi.list({ limit: 200 }));
  const { data: roles, loading: rolesLoading } = useApi(() => rolesApi.list({ limit: 100 }));

  const toggleSkill = (skillName) => {
    setSelectedSkills((prev) =>
      prev.includes(skillName) ? prev.filter((s) => s !== skillName) : [...prev, skillName]
    );
  };

  const runAnalysis = async () => {
    if (!targetRole || selectedSkills.length === 0) return;
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const result = await graphApi.skillGap(selectedSkills, targetRole);
      setAnalysisResult(result.data);
    } catch (err) {
      setAnalysisError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  // Group skills by category for selection
  const skillsByCategory = useMemo(() => {
    if (!allSkills) return {};
    const groups = {};
    allSkills.forEach((s) => {
      if (!groups[s.category]) groups[s.category] = [];
      groups[s.category].push(s);
    });
    return groups;
  }, [allSkills]);

  const circumference = 2 * Math.PI * 48;
  const matchOffset = analysisResult
    ? circumference - (circumference * analysisResult.matchPercentage) / 100
    : circumference;

  if (skillsLoading || rolesLoading) return <Layout title="Skill Gap Analyzer"><Loader /></Layout>;

  return (
    <Layout title="Skill Gap Analyzer">
      <div className="section-header">
        <h2 className="section-title gradient-text">🎯 Skill Gap Analyzer</h2>
        <p className="section-subtitle">
          Select your current skills and a target role to discover what you need to learn
        </p>
      </div>

      <div className="skill-gap-layout">
        {/* Left: Skill Selection */}
        <div>
          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="skill-detail-section-title" style={{ marginBottom: 'var(--space-3)' }}>
              Your Current Skills ({selectedSkills.length} selected)
            </div>

            {/* Selected chips */}
            {selectedSkills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                {selectedSkills.map((s) => (
                  <span key={s} className="chip selected" onClick={() => toggleSkill(s)}>
                    {s} <span className="chip-remove">×</span>
                  </span>
                ))}
              </div>
            )}

            {/* Skill categories */}
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {Object.entries(skillsByCategory).map(([cat, catSkills]) => (
                <div key={cat} style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>
                    {cat}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                    {catSkills.map((skill) => (
                      <span
                        key={skill.name}
                        className={`chip ${selectedSkills.includes(skill.name) ? 'selected' : ''}`}
                        onClick={() => toggleSkill(skill.name)}
                      >
                        {skill.icon} {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Role Selector */}
          <div className="card">
            <div className="skill-detail-section-title" style={{ marginBottom: 'var(--space-3)' }}>
              Target Role
            </div>
            <select
              className="select"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              style={{ width: '100%', marginBottom: 'var(--space-4)' }}
              id="gap-role-selector"
            >
              <option value="">Choose a target role…</option>
              {roles?.map((r) => (
                <option key={r.title} value={r.title}>{r.title} ({r.level})</option>
              ))}
            </select>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              onClick={runAnalysis}
              disabled={!targetRole || selectedSkills.length === 0 || analyzing}
              id="analyze-button"
            >
              {analyzing ? 'Analyzing…' : '🎯 Analyze Skill Gap'}
            </button>
          </div>
        </div>

        {/* Right: Results */}
        <div>
          {analysisError && (
            <ErrorState message={analysisError} onRetry={runAnalysis} />
          )}

          {analyzing && <Loader text="Analyzing your skill gap…" />}

          {!analyzing && !analysisResult && !analysisError && (
            <EmptyState
              icon="🎯"
              title="Ready to analyze"
              description="Select your skills and a target role, then click Analyze"
            />
          )}

          {analysisResult && !analyzing && (
            <div className="animate-fade-in">
              {/* Match Summary */}
              <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                <div className="skill-gap-summary">
                  <div className="skill-gap-circle">
                    <svg viewBox="0 0 120 120">
                      <defs>
                        <linearGradient id="gapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#7c3aed" />
                          <stop offset="100%" stopColor="#14b8a6" />
                        </linearGradient>
                      </defs>
                      <circle className="skill-gap-circle-bg" cx="60" cy="60" r="48" />
                      <circle
                        className="skill-gap-circle-fill"
                        cx="60" cy="60" r="48"
                        strokeDasharray={circumference}
                        strokeDashoffset={matchOffset}
                      />
                    </svg>
                    <div className="skill-gap-percentage gradient-text">
                      {analysisResult.matchPercentage}%
                    </div>
                  </div>
                  <div className="skill-gap-stats">
                    <div className="skill-gap-stat">
                      Target: <strong>{analysisResult.targetRole}</strong>
                    </div>
                    <div className="skill-gap-stat">
                      Skills matched: <strong style={{ color: 'var(--green)' }}>{analysisResult.currentCount}</strong> / {analysisResult.totalRequired}
                    </div>
                    <div className="skill-gap-stat">
                      Skills to learn: <strong style={{ color: 'var(--amber)' }}>{analysisResult.missingCount}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Missing Skills */}
              {analysisResult.missingSkills?.length > 0 && (
                <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                  <div className="skill-detail-section-title" style={{ marginBottom: 'var(--space-3)' }}>
                    ❌ Skills You Need to Learn
                  </div>
                  {analysisResult.missingSkills.map((s) => (
                    <div className="dashboard-list-item" key={s.name}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{s.name}</div>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', marginTop: 2 }}>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{s.domain}</span>
                          <Difficulty level={s.difficulty} />
                        </div>
                      </div>
                      <Badge variant={s.importance === 'core' ? 'red' : s.importance === 'preferred' ? 'amber' : 'gray'}>
                        {s.importance}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              {/* Current Skills Match */}
              {analysisResult.currentSkills?.length > 0 && (
                <div className="card">
                  <div className="skill-detail-section-title" style={{ marginBottom: 'var(--space-3)' }}>
                    ✅ Skills You Already Have
                  </div>
                  {analysisResult.currentSkills.map((s) => (
                    <div className="dashboard-list-item" key={s.name}>
                      <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{s.name}</div>
                      <Badge variant="green">{s.importance}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
