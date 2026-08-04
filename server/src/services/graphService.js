/**
 * Graph Service
 *
 * Handles graph traversal queries for visualization — neighborhood
 * expansion, full network, and skill-gap analysis. Returns data
 * formatted for D3.js force-directed graphs.
 */

const { readQuery } = require('../config/database');
const { nodeToObj, relToObj, deepConvert, toNum } = require('../utils/cypher');

/**
 * Builds a { nodes, links } object from raw Neo4j path/node/rel records,
 * de-duplicating by element ID.
 */
function buildGraphData(nodesRaw, relsRaw) {
  const nodeMap = new Map();
  const linkMap = new Map();

  for (const n of nodesRaw) {
    if (!n) continue;
    const obj = nodeToObj(n);
    if (obj._id) nodeMap.set(obj._id, obj);
  }

  for (const r of relsRaw) {
    if (!r) continue;
    const obj = relToObj(r);
    if (obj._id) linkMap.set(obj._id, obj);
  }

  return {
    nodes: Array.from(nodeMap.values()),
    links: Array.from(linkMap.values()).map((l) => ({
      ...l,
      source: l._startId,
      target: l._endId,
    })),
  };
}

/**
 * Get the neighborhood of a node (1–2 hops) for graph visualization.
 */
async function getNeighborhood(nodeType, nodeName, depth = 2) {
  const label = nodeType.charAt(0).toUpperCase() + nodeType.slice(1);
  const cypher = `
    MATCH (center:${label} {name: $name})
    CALL {
      WITH center
      MATCH (center)-[r]-(neighbor)
      RETURN collect(DISTINCT neighbor) AS hop1Nodes, collect(DISTINCT r) AS hop1Rels
    }
    CALL {
      WITH center
      MATCH (center)-[r1]-()-[r2]-(neighbor2)
      WHERE $depth >= 2
      RETURN collect(DISTINCT neighbor2) AS hop2Nodes,
             collect(DISTINCT r1) + collect(DISTINCT r2) AS hop2Rels
    }
    RETURN center,
           hop1Nodes, hop1Rels,
           hop2Nodes, hop2Rels`;

  const records = await readQuery(cypher, { name: nodeName, depth: parseInt(depth, 10) });
  if (!records.length) return { nodes: [], links: [] };

  const r = records[0];
  const allNodes = [
    r.get('center'),
    ...r.get('hop1Nodes'),
    ...(parseInt(depth, 10) >= 2 ? r.get('hop2Nodes') : []),
  ];
  const allRels = [
    ...r.get('hop1Rels'),
    ...(parseInt(depth, 10) >= 2 ? r.get('hop2Rels') : []),
  ];

  return buildGraphData(allNodes, allRels);
}

/**
 * Get full network overview — limited subset for initial visualization.
 */
async function getFullNetwork(limit = 150) {
  const cypher = `
    MATCH (n)
    WHERE n:Skill OR n:Role OR n:Domain
    WITH n LIMIT toInteger($limit)
    OPTIONAL MATCH (n)-[r]-(m)
    WHERE m:Skill OR m:Role OR m:Domain
    RETURN collect(DISTINCT n) + collect(DISTINCT m) AS nodes,
           collect(DISTINCT r) AS rels`;
  const records = await readQuery(cypher, { limit });
  if (!records.length) return { nodes: [], links: [] };

  const r = records[0];
  return buildGraphData(r.get('nodes'), r.get('rels'));
}

/**
 * Skill gap analysis — finds skills a professional is missing for a target role.
 * Multi-step graph traversal that would require awkward anti-joins in SQL.
 */
async function analyzeSkillGap(currentSkills, targetRole) {
  const cypher = `
    MATCH (target:Role {title: $targetRole})-[req:REQUIRES]->(needed:Skill)
    OPTIONAL MATCH (needed)-[:BELONGS_TO]->(d:Domain)
    WITH needed, req.importance AS importance, d.name AS domain,
         CASE WHEN needed.name IN $currentSkills THEN true ELSE false END AS hasSkill
    RETURN needed {.name, .category, .difficulty} AS skill,
           importance,
           domain,
           hasSkill
    ORDER BY hasSkill, needed.difficulty`;
  const records = await readQuery(cypher, { currentSkills, targetRole });

  const has = [];
  const missing = [];
  for (const r of records) {
    const item = {
      ...deepConvert(r.get('skill')),
      importance: r.get('importance'),
      domain: r.get('domain'),
    };
    if (r.get('hasSkill')) {
      has.push(item);
    } else {
      missing.push(item);
    }
  }

  return {
    targetRole,
    totalRequired: has.length + missing.length,
    currentCount: has.length,
    missingCount: missing.length,
    matchPercentage: has.length + missing.length > 0
      ? Math.round((has.length / (has.length + missing.length)) * 100)
      : 0,
    currentSkills: has,
    missingSkills: missing,
  };
}

/**
 * Find professionals with similar skills.
 * Multi-hop through shared skill nodes — very awkward in SQL.
 */
async function getSimilarProfessionals(professionalName, limit = 10) {
  const cypher = `
    MATCH (p1:Professional {name: $name})-[:HAS_SKILL]->(s:Skill)<-[:HAS_SKILL]-(p2:Professional)
    WHERE p1 <> p2
    WITH p2, collect(s.name) AS shared_skills, count(s) AS overlap
    OPTIONAL MATCH (p2)-[:WORKS_AS]->(r:Role)
    RETURN p2 {.name, .current_role, .experience_years, .location} AS professional,
           r.title AS role_title,
           shared_skills,
           overlap
    ORDER BY overlap DESC
    LIMIT toInteger($limit)`;
  const records = await readQuery(cypher, { name: professionalName, limit });
  return records.map((r) => ({
    ...deepConvert(r.get('professional')),
    role: r.get('role_title'),
    sharedSkills: r.get('shared_skills'),
    overlap: toNum(r.get('overlap')),
  }));
}

/**
 * Get skill path as graph data (for visualization).
 */
async function getSkillPathGraph(fromSkill, toSkill) {
  const cypher = `
    MATCH path = shortestPath(
      (s1:Skill {name: $fromSkill})-[:PREREQUISITE_OF*1..8]->(s2:Skill {name: $toSkill})
    )
    UNWIND nodes(path) AS n
    UNWIND relationships(path) AS r
    WITH collect(DISTINCT n) AS pathNodes, collect(DISTINCT r) AS pathRels
    RETURN pathNodes, pathRels`;
  const records = await readQuery(cypher, { fromSkill, toSkill });
  if (!records.length) return { nodes: [], links: [] };

  const r = records[0];
  return buildGraphData(r.get('pathNodes'), r.get('pathRels'));
}

module.exports = {
  getNeighborhood,
  getFullNetwork,
  analyzeSkillGap,
  getSimilarProfessionals,
  getSkillPathGraph,
};
