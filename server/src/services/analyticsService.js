/**
 * Analytics Service
 *
 * Dashboard metrics and aggregate analytics queries.
 */

const { readQuery } = require('../config/database');
const { toNum, deepConvert } = require('../utils/cypher');

/**
 * Dashboard summary metrics.
 */
async function getDashboardMetrics() {
  const cypher = `
    OPTIONAL MATCH (s:Skill) WITH count(s) AS skillCount
    OPTIONAL MATCH (r:Role) WITH skillCount, count(r) AS roleCount
    OPTIONAL MATCH (d:Domain) WITH skillCount, roleCount, count(d) AS domainCount
    OPTIONAL MATCH (lr:LearningResource) WITH skillCount, roleCount, domainCount, count(lr) AS resourceCount
    OPTIONAL MATCH (p:Professional) WITH skillCount, roleCount, domainCount, resourceCount, count(p) AS professionalCount
    OPTIONAL MATCH ()-[rel]->() WITH skillCount, roleCount, domainCount, resourceCount, professionalCount, count(rel) AS relCount
    RETURN skillCount, roleCount, domainCount, resourceCount, professionalCount, relCount`;
  const records = await readQuery(cypher);
  if (!records.length) {
    return { skills: 0, roles: 0, domains: 0, resources: 0, professionals: 0, relationships: 0 };
  }
  const r = records[0];
  return {
    skills: toNum(r.get('skillCount')),
    roles: toNum(r.get('roleCount')),
    domains: toNum(r.get('domainCount')),
    resources: toNum(r.get('resourceCount')),
    professionals: toNum(r.get('professionalCount')),
    relationships: toNum(r.get('relCount')),
  };
}

/**
 * Domain distribution — number of skills per domain.
 */
async function getDomainDistribution() {
  const cypher = `
    MATCH (d:Domain)<-[:BELONGS_TO]-(s:Skill)
    RETURN d {.name, .color} AS domain, count(s) AS skillCount
    ORDER BY skillCount DESC`;
  const records = await readQuery(cypher);
  return records.map((r) => ({
    ...deepConvert(r.get('domain')),
    skillCount: toNum(r.get('skillCount')),
  }));
}

/**
 * Top skills by number of roles that require them.
 */
async function getTopRequiredSkills(limit = 10) {
  const cypher = `
    MATCH (r:Role)-[:REQUIRES]->(s:Skill)
    WITH s, count(r) AS demand
    OPTIONAL MATCH (s)-[:BELONGS_TO]->(d:Domain)
    RETURN s {.name, .category} AS skill, d.name AS domain, demand
    ORDER BY demand DESC
    LIMIT toInteger($limit)`;
  const records = await readQuery(cypher, { limit });
  return records.map((r) => ({
    ...deepConvert(r.get('skill')),
    domain: r.get('domain'),
    demand: toNum(r.get('demand')),
  }));
}

/**
 * Salary distribution by role level.
 */
async function getSalaryByLevel() {
  const cypher = `
    MATCH (r:Role)
    WHERE r.avg_salary IS NOT NULL
    RETURN r.level AS level,
           avg(r.avg_salary) AS avgSalary,
           min(r.avg_salary) AS minSalary,
           max(r.avg_salary) AS maxSalary,
           count(r) AS roleCount
    ORDER BY avgSalary`;
  const records = await readQuery(cypher);
  return records.map((r) => ({
    level: r.get('level'),
    avgSalary: Math.round(toNum(r.get('avgSalary'))),
    minSalary: toNum(r.get('minSalary')),
    maxSalary: toNum(r.get('maxSalary')),
    roleCount: toNum(r.get('roleCount')),
  }));
}

module.exports = {
  getDashboardMetrics,
  getDomainDistribution,
  getTopRequiredSkills,
  getSalaryByLevel,
};
