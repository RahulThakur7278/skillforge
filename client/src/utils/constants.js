/* Node type → color mapping for graph visualization */
export const NODE_COLORS = {
  Skill: '#7c3aed',
  Role: '#2563eb',
  Domain: '#14b8a6',
  LearningResource: '#f59e0b',
  Professional: '#ec4899',
};

/* Node type → radius */
export const NODE_RADII = {
  Skill: 8,
  Role: 10,
  Domain: 14,
  LearningResource: 7,
  Professional: 7,
};

/* Relationship type labels */
export const REL_LABELS = {
  PREREQUISITE_OF: 'prerequisite of',
  COMPLEMENTARY_TO: 'complements',
  BELONGS_TO: 'belongs to',
  REQUIRES: 'requires',
  TEACHES: 'teaches',
  HAS_SKILL: 'has skill',
  WORKS_AS: 'works as',
  LEADS_TO: 'leads to',
  RELATED_TO: 'related to',
};

/* Importance badge variant */
export const IMPORTANCE_BADGE = {
  core: 'badge-core',
  preferred: 'badge-preferred',
  'nice-to-have': 'badge-nice-to-have',
};

/* Difficulty labels */
export const DIFFICULTY_LABELS = ['', 'Beginner', 'Easy', 'Intermediate', 'Advanced', 'Expert'];

/* Format salary as $XXXk */
export function formatSalary(salary) {
  if (!salary) return '—';
  return `$${Math.round(salary / 1000)}k`;
}

/* Truncate long text */
export function truncate(str, len = 80) {
  if (!str || str.length <= len) return str;
  return str.slice(0, len).trimEnd() + '…';
}

/* Get primary label from _labels array */
export function getPrimaryLabel(labels) {
  if (!labels?.length) return 'Unknown';
  const priority = ['Domain', 'Role', 'Skill', 'LearningResource', 'Professional'];
  return priority.find((l) => labels.includes(l)) || labels[0];
}
