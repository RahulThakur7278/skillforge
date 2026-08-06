/**
 * Skill Service
 *
 * All Cypher queries related to skills — search, listing,
 * prerequisites, influence scores, cross-domain bridges.
 * Every query is parameterized via the official Neo4j driver.
 */

import { readQuery } from '../config/database.js';
import { nodeToObj, deepConvert, toNum } from '../utils/cypher.js';

/**
 * List all skills, optionally filtered by category or search term.
 */
async function listSkills({ search, category, limit = 50 } = {}) {
  let cypher = 'MATCH (s:Skill)';
  const params = { limit: parseInt(limit, 10) };

  const conditions = [];
  if (search) {
    conditions.push('toLower(s.name) CONTAINS toLower($search)');
    params.search = search;
  }
  if (category) {
    conditions.push('s.category = $category');
    params.category = category;
  }
  if (conditions.length) cypher += ` WHERE ${conditions.join(' AND ')}`;

  cypher += `
    OPTIONAL MATCH (s)-[:BELONGS_TO]->(d:Domain)
    RETURN s, d.name AS domain
    ORDER BY s.name
    LIMIT toInteger($limit)`;

  const records = await readQuery(cypher, params);
  return records.map((r) => ({
    ...nodeToObj(r.get('s')),
    domain: r.get('domain'),
  }));
}

/**
 * Get a single skill by name with its domain and prerequisites.
 */
async function getSkillByName(name) {
  const cypher = `
    MATCH (s:Skill {name: $name})
    OPTIONAL MATCH (s)-[:BELONGS_TO]->(d:Domain)
    OPTIONAL MATCH (prereq:Skill)-[:PREREQUISITE_OF]->(s)
    OPTIONAL MATCH (s)-[:PREREQUISITE_OF]->(unlocks:Skill)
    OPTIONAL MATCH (s)<-[:TEACHES]-(lr:LearningResource)
    RETURN s,
           d.name AS domain,
           collect(DISTINCT prereq {.name, .difficulty}) AS prerequisites,
           collect(DISTINCT unlocks {.name, .difficulty}) AS unlocks,
           collect(DISTINCT lr {.title, .type, .provider, .url, .rating}) AS resources`;
  const records = await readQuery(cypher, { name });
  if (!records.length) return null;

  const r = records[0];
  return {
    ...nodeToObj(r.get('s')),
    domain: r.get('domain'),
    prerequisites: deepConvert(r.get('prerequisites')),
    unlocks: deepConvert(r.get('unlocks')),
    resources: deepConvert(r.get('resources')),
  };
}

/**
 * Get all skill categories.
 */
async function getCategories() {
  const cypher = `
    MATCH (s:Skill)
    RETURN DISTINCT s.category AS category, count(s) AS count
    ORDER BY count DESC`;
  const records = await readQuery(cypher);
  return records.map((r) => ({
    category: r.get('category'),
    count: toNum(r.get('count')),
  }));
}

/**
 * Shortest learning path between two skills (multi-hop, ≥2 hops).
 */
async function getSkillPath(fromSkill, toSkill) {
  const cypher = `
    MATCH path = shortestPath(
      (s1:Skill {name: $fromSkill})-[:PREREQUISITE_OF*1..8]->(s2:Skill {name: $toSkill})
    )
    RETURN [n IN nodes(path) | n {.name, .category, .difficulty, _labels: labels(n)}] AS skills,
           length(path) AS hops`;
  const records = await readQuery(cypher, { fromSkill, toSkill });
  if (!records.length) return null;

  const r = records[0];
  return {
    skills: deepConvert(r.get('skills')),
    hops: toNum(r.get('hops')),
  };
}

/**
 * Skill influence score — which skills unlock the most downstream skills.
 * Pure graph metric that is extremely awkward in SQL.
 */
async function getSkillInfluence(limit = 15) {
  const cypher = `
    MATCH (s:Skill)-[:PREREQUISITE_OF*1..4]->(downstream:Skill)
    WITH s, count(DISTINCT downstream) AS influence
    OPTIONAL MATCH (s)-[:BELONGS_TO]->(d:Domain)
    RETURN s {.name, .category, .difficulty} AS skill,
           d.name AS domain,
           influence
    ORDER BY influence DESC
    LIMIT toInteger($limit)`;
  const records = await readQuery(cypher, { limit });
  return records.map((r) => ({
    ...deepConvert(r.get('skill')),
    domain: r.get('domain'),
    influence: toNum(r.get('influence')),
  }));
}

/**
 * Cross-domain bridge skills — skills that connect multiple domains.
 * This query would require complex self-joins in SQL.
 */
async function getBridgeSkills() {
  const cypher = `
    MATCH (d1:Domain)<-[:BELONGS_TO]-(s:Skill)-[:BELONGS_TO]->(d2:Domain)
    WHERE elementId(d1) < elementId(d2)
    RETURN s {.name, .category, .difficulty} AS skill,
           collect(DISTINCT d1.name) + collect(DISTINCT d2.name) AS domains
    ORDER BY s.name`;
  const records = await readQuery(cypher);
  return records.map((r) => ({
    ...deepConvert(r.get('skill')),
    domains: r.get('domains'),
  }));
}

/**
 * Complementary skills — skills that pair well with a given skill.
 */
async function getComplementarySkills(skillName) {
  const cypher = `
    MATCH (s:Skill {name: $skillName})-[r:COMPLEMENTARY_TO]-(comp:Skill)
    OPTIONAL MATCH (comp)-[:BELONGS_TO]->(d:Domain)
    RETURN comp {.name, .category, .difficulty} AS skill,
           d.name AS domain,
           r.strength AS strength
    ORDER BY r.strength DESC`;
  const records = await readQuery(cypher, { skillName });
  return records.map((r) => ({
    ...deepConvert(r.get('skill')),
    domain: r.get('domain'),
    strength: r.get('strength'),
  }));
}

export {
  listSkills,
  getSkillByName,
  getCategories,
  getSkillPath,
  getSkillInfluence,
  getBridgeSkills,
  getComplementarySkills,
};
