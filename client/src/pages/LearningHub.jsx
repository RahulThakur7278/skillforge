import { useState, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import { Loader, ErrorState, EmptyState, Badge, SearchInput } from '../components/common';
import { skillsApi } from '../services/api';
import { useApi } from '../hooks/useApi';
import { useDebounce } from '../hooks/useDebounce';

export default function LearningHub() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'course' | 'book' | 'tutorial'
  const debouncedSearch = useDebounce(search);

  const { data: skills, loading, error, refetch } = useApi(() => skillsApi.list({ limit: 200 }));

  // Flatten all resources from all skills
  const allResources = useMemo(() => {
    if (!skills) return [];
    const map = new Map();
    skills.forEach((skill) => {
      // We don't have resources directly from the list endpoint,
      // so we rely on a separate approach
    });
    return [];
  }, [skills]);

  // Since we can't get resources from skills/list, let's use a combined approach
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);

  // Fetch skills with resources by loading popular ones
  useState(() => {
    async function loadResources() {
      setResourcesLoading(true);
      try {
        // Fetch details for popular skills to get their resources
        const popularSkills = ['React', 'Python', 'JavaScript', 'Machine Learning', 'Docker',
          'TypeScript', 'Node.js', 'AWS', 'SQL', 'System Design', 'Deep Learning',
          'Kubernetes', 'Go', 'Next.js', 'Django', 'Figma', 'Java', 'Flutter',
          'NLP', 'Terraform'];

        const results = await Promise.allSettled(
          popularSkills.map((name) => skillsApi.get(name))
        );

        const allRes = new Map();
        results.forEach((r) => {
          if (r.status === 'fulfilled' && r.value?.data?.resources) {
            r.value.data.resources.forEach((res) => {
              if (!allRes.has(res.title)) {
                allRes.set(res.title, { ...res, skills: [] });
              }
              allRes.get(res.title).skills.push(r.value.data.name);
            });
          }
        });

        setResources(Array.from(allRes.values()));
      } catch {
        // Fallback gracefully
      } finally {
        setResourcesLoading(false);
      }
    }
    loadResources();
  });

  // Filter resources
  const filtered = useMemo(() => {
    let result = resources;
    if (filter !== 'all') {
      result = result.filter((r) => r.type === filter);
    }
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.provider?.toLowerCase().includes(q) ||
          r.skills?.some((s) => s.toLowerCase().includes(q))
      );
    }
    return result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [resources, filter, debouncedSearch]);

  const typeIcon = { course: '🎓', book: '📖', tutorial: '💻' };

  if (loading && resourcesLoading) return <Layout title="Learning Hub"><Loader text="Loading resources…" /></Layout>;
  if (error) return <Layout title="Learning Hub"><ErrorState message={error} onRetry={refetch} /></Layout>;

  return (
    <Layout title="Learning Hub">
      <div className="section-header">
        <h2 className="section-title gradient-text">📚 Learning Hub</h2>
        <p className="section-subtitle">
          Curated learning resources from the skill graph — courses, books, and tutorials
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search resources or skills…"
        />
        <div className="tabs">
          {['all', 'course', 'book', 'tutorial'].map((t) => (
            <button
              key={t}
              className={`tab ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t === 'all' ? '📋 All' : `${typeIcon[t]} ${t.charAt(0).toUpperCase() + t.slice(1)}s`}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginLeft: 'auto' }}>
          {filtered.length} resources
        </span>
      </div>

      {/* Resource Grid */}
      {resourcesLoading ? (
        <Loader text="Loading learning resources…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No resources found"
          description="Try adjusting your search or filter"
        />
      ) : (
        <div className="resource-grid stagger">
          {filtered.map((resource) => (
            <div key={resource.title} className="card card-interactive card-glow">
              <div className="resource-card-header">
                <div>
                  <div className="resource-card-title">{resource.title}</div>
                  <div className="resource-card-provider">{resource.provider}</div>
                </div>
                <Badge variant={
                  resource.type === 'course' ? 'purple' :
                  resource.type === 'book' ? 'blue' : 'teal'
                }>
                  {typeIcon[resource.type]} {resource.type}
                </Badge>
              </div>

              {/* Skills taught */}
              <div className="resource-card-skills">
                {resource.skills?.map((s) => (
                  <span key={s} className="chip" style={{ cursor: 'default', fontSize: '10px', padding: '2px 8px' }}>
                    {s}
                  </span>
                ))}
              </div>

              <div className="resource-card-meta">
                <span className="resource-rating">⭐ {resource.rating}</span>
                {resource.duration_hours && <span>⏱ {resource.duration_hours}h</span>}
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                    style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
