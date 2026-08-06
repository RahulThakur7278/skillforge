/**
 * Cypher Query Helpers
 *
 * Utility functions for transforming Neo4j records into
 * plain JS objects suitable for JSON responses.
 */

import neo4j from 'neo4j-driver';

/**
 * Converts a Neo4j Integer to a JS number.
 */
function toNum(v) {
  if (neo4j.isInt(v)) return v.toNumber();
  if (typeof v === 'number') return v;
  return v;
}

/**
 * Recursively converts all Neo4j Integers in an object.
 */
function deepConvert(obj) {
  if (obj === null || obj === undefined) return obj;
  if (neo4j.isInt(obj)) return obj.toNumber();
  if (Array.isArray(obj)) return obj.map(deepConvert);
  if (typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = deepConvert(v);
    }
    return out;
  }
  return obj;
}

/**
 * Extracts node properties from a Neo4j Node record entry.
 * Adds `_id` (element id) and `_labels`.
 */
function nodeToObj(node) {
  if (!node) return null;
  return {
    _id: node.elementId || node.identity?.toString(),
    _labels: node.labels || [],
    ...deepConvert(node.properties || {}),
  };
}

/**
 * Extracts relationship properties from a Neo4j Relationship.
 */
function relToObj(rel) {
  if (!rel) return null;
  return {
    _id: rel.elementId || rel.identity?.toString(),
    _type: rel.type,
    _startId: rel.startNodeElementId || rel.start?.toString(),
    _endId: rel.endNodeElementId || rel.end?.toString(),
    ...deepConvert(rel.properties || {}),
  };
}

export { toNum, deepConvert, nodeToObj, relToObj };
