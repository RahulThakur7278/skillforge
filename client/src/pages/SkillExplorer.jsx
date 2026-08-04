import { useState, useCallback } from 'react';
import Layout from '../components/layout/Layout';
import ForceGraph from '../components/graph/ForceGraph';
import { Loader, ErrorState, EmptyState, SearchInput, Badge, Difficulty } from '../components/common';
import { graphApi, skillsApi } from '../services/api';
import { useApi } from '../hooks/useApi';
import { useDebounce } from '../hooks/useDebounce';
import { IMPORTANCE_BADGE } from '../utils/constants';

export default function SkillExplorer() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('network'); // 'network' | 'neighborhood'
  const debouncedSearch = useDebounce(searchTerm);

  // Full network data
  const { data: networkData, loading: netLoading, error: netError, refetch: refetchNet } =
    useApi(() => graphApi.network(200));

  // Neighborhood data (when a node is selected)
  const { data: neighborhoodData, loading: nbLoading } = useApi(
    () => graphApi.neighborhood('skill', selectedNode?.name || selectedNode?.title, 2),
    [selectedNode?._id],
    { enabled: !!selectedNode && viewMode === 'neighborhood' }
  );

  // Skill detail
  const { data: skillDetail, loading: detailLoading } = useApi(
    () => skillsApi.get(selectedNode?.name),
    [selectedNode?.name],
    { enabled: !!selectedNode?.name && selectedNode?._labels?.includes('Skill') }
  );

  // Search results
  const { data: searchResults } = useApi(
    () => skillsApi.list({ search: debouncedSearch, limit: 20 }),
    [debouncedSearch],
    { enabled: debouncedSearch.length >= 2 }
  );

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);
    setViewMode('neighborhood');
  }, []);

  const handleBackToNetwork = useCallback(() => {
    setViewMode('network');
    setSelectedNode(null);
  }, []);

  const handleSearchSelect = useCallback((skill) => {
    setSelectedNode({ name: skill.name, _labels: ['Skill'], ...skill });
    setViewMode('neighborhood');
    setSearchTerm('');
  }, []);

  const graphData = viewMode === 'neighborhood' && neighborhoodData ? neighborhoodData : networkData;
  const isLoading = viewMode === 'network' ? netLoading : nbLoading;

  if (netError) {
    return <Layout title="Skill Explorer"><ErrorState message={netError} onRetry={refetchNet} /></Layout>;
  }

  return (
    <Layout title="Skill Explorer">
      {/* Controls */}
      <div className="explorer-controls">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search skills…"
        />
        {viewMode === 'neighborhood' && (
          <button className="btn btn-secondary btn-sm" onClick={handleBackToNetwork}>
            ← Back to Full Network
          </button>
        )}
        <div style={{ flex: 1 }} />
        <div className="tabs">
          <button
            className={`tab ${viewMode === 'network' ? 'active' : ''}`}
            onClick={handleBackToNetwork}
          >
            Full Network
          </button>
          <button
            className={`tab ${viewMode === 'neighborhood' ? 'active' : ''}`}
            disabled={!selectedNode}
          >
            Neighborhood
          </button>
        </div>
      </div>

      {/* Search Dropdown */}
      {debouncedSearch.length >= 2 && searchResults?.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-2)' }}>
          {searchResults.map((skill) => (
            <div
              key={skill.name}
              className="skill-list-item"
              onClick={() => handleSearchSelect(skill)}
            >
              <span>{skill.icon || '⚡'}</span>
              <span style={{ fontWeight: 500 }}>{skill.name}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginLeft: 'auto' }}>
                {skill.domain}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Main Layout */}
      <div className="explorer-layout">
        {/* Graph Panel */}
        <div className="explorer-graph-panel" id="graph-panel">
          {isLoading ? (
            <Loader text="Loading graph…" />
          ) : !graphData?.nodes?.length ? (
            <EmptyState icon="🕸️" title="No graph data" description="Run the seed script to populate the database" />
          ) : (
            <ForceGraph
              data={graphData}
              onNodeClick={handleNodeClick}
              selectedNode={selectedNode}
            />
          )}
        </div>

        {/* Sidebar Detail Panel */}
        <div className="explorer-sidebar-panel">
          {selectedNode ? (
            <div className="card skill-detail animate-fade-in">
              {detailLoading ? (
                <Loader text="Loading details…" />
              ) : skillDetail ? (
                <>
                  <div className="skill-detail-header">
                    <span className="skill-detail-icon">{skillDetail.icon || '⚡'}</span>
                    <div>
                      <h3 className="skill-detail-name">{skillDetail.name}</h3>
                      <span className="skill-detail-category">{skillDetail.category}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                    {skillDetail.description}
                  </p>

                  <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    {skillDetail.domain && <Badge variant="teal">{skillDetail.domain}</Badge>}
                    <Difficulty level={skillDetail.difficulty} />
                  </div>

                  {/* Prerequisites */}
                  {skillDetail.prerequisites?.length > 0 && (
                    <div className="skill-detail-section">
                      <div className="skill-detail-section-title">📋 Prerequisites</div>
                      {skillDetail.prerequisites.map((p) => (
                        <div
                          key={p.name}
                          className="skill-list-item"
                          onClick={() => handleSearchSelect({ name: p.name, _labels: ['Skill'] })}
                        >
                          <span style={{ color: 'var(--amber)' }}>←</span>
                          <span>{p.name}</span>
                          <Difficulty level={p.difficulty} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Unlocks */}
                  {skillDetail.unlocks?.length > 0 && (
                    <div className="skill-detail-section">
                      <div className="skill-detail-section-title">🔓 Unlocks</div>
                      {skillDetail.unlocks.map((u) => (
                        <div
                          key={u.name}
                          className="skill-list-item"
                          onClick={() => handleSearchSelect({ name: u.name, _labels: ['Skill'] })}
                        >
                          <span style={{ color: 'var(--green)' }}>→</span>
                          <span>{u.name}</span>
                          <Difficulty level={u.difficulty} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Resources */}
                  {skillDetail.resources?.length > 0 && (
                    <div className="skill-detail-section">
                      <div className="skill-detail-section-title">📚 Learning Resources</div>
                      {skillDetail.resources.map((r) => (
                        <div key={r.title} className="skill-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                          <div style={{ fontWeight: 500 }}>{r.title}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'flex', gap: 'var(--space-3)' }}>
                            <span>{r.provider}</span>
                            <span>⭐ {r.rating}</span>
                            <Badge variant="gray">{r.type}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                    {selectedNode.name || selectedNode.title}
                  </h3>
                  <Badge variant="blue">{selectedNode._labels?.[0]}</Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="card">
              <EmptyState
                icon="👆"
                title="Select a node"
                description="Click any node in the graph to view its details, prerequisites, and connections"
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
