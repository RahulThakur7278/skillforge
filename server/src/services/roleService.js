/**
 * Role Service
 *
 * Cypher queries for professional roles — listing, career paths,
 * required skills, and role-to-role progression traversals.
 */

import { readQuery } from '../config/database.js';
import { nodeToObj, deepConvert, toNum } from '../utils/cypher.js';

/**
 * List all roles, optionally filtered by level or domain.
 */
async function listRoles({ level, domain, limit = 50 } = {}) {
  let cypher = 'MATCH (r:Role)';
  const params = { limit: parseInt(limit, 10) };
  const conditions = [];

  if (level) {
    conditions.push('r.level = $level');
    params.level = level;
  }
  if (domain) {
    conditions.push('r.domain = $domain');
    params.domain = domain;
  }
  if (conditions.length) cypher += ` WHERE ${conditions.join(' AND ')}`;

  cypher += `
    RETURN r
    ORDER BY r.avg_salary DESC
    LIMIT toInteger($limit)`;

  const records = await readQuery(cypher, params);
  return records.map((r) => nodeToObj(r.get('r')));
}

/**
 * Get a role with its required skills.
 */
async function getRoleByTitle(title) {
  const cypher = `
    MATCH (r:Role {title: $title})
    OPTIONAL MATCH (r)-[req:REQUIRES]->(s:Skill)
    OPTIONAL MATCH (s)-[:BELONGS_TO]->(d:Domain)
    RETURN r,
           collect(DISTINCT {
             name: s.name,
             category: s.category,
             difficulty: s.difficulty,
             importance: req.importance,
             domain: d.name
           }) AS required_skills`;
  const records = await readQuery(cypher, { title });
  if (!records.length) return null;

  const rec = records[0];
  return {
    ...nodeToObj(rec.get('r')),
    required_skills: deepConvert(rec.get('required_skills')).filter((s) => s.name),
  };
}

/**
 * Career progression path from a given role (multi-hop, ≥2 hops).
 * Finds all forward career paths up to 4 hops deep.
 */
async function getCareerPaths(currentRole) {
  const cypher = `
    MATCH path = (start:Role {title: $currentRole})-[:LEADS_TO*1..4]->(future:Role)
    WITH path, future,
         [n IN nodes(path) | n {.title, .level, .avg_salary, .domain}] AS steps
    RETURN steps,
           length(path) AS depth
    ORDER BY depth, future.avg_salary DESC`;
  const records = await readQuery(cypher, { currentRole });
  return records.map((r) => ({
    steps: deepConvert(r.get('steps')),
    depth: toNum(r.get('depth')),
  }));
}

/**
 * Get all role levels for filtering.
 */
async function getRoleLevels() {
  const cypher = `
    MATCH (r:Role)
    RETURN DISTINCT r.level AS level, count(r) AS count
    ORDER BY count DESC`;
  const records = await readQuery(cypher);
  return records.map((r) => ({
    level: r.get('level'),
    count: toNum(r.get('count')),
  }));
}

export {
  listRoles,
  getRoleByTitle,
  getCareerPaths,
  getRoleLevels,
};
