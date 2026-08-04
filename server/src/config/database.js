/**
 * CognoDB Database Connection Manager
 *
 * Manages the Neo4j driver singleton that connects to CognoDB Cloud
 * over the Bolt protocol (5.0–5.4). Provides connection verification
 * and graceful shutdown.
 */

const neo4j = require('neo4j-driver');
const { getConfig } = require('./env');
const { logger } = require('../utils/logger');

let _driver = null;

/**
 * Returns the Neo4j driver singleton.
 * Creates it on first call using env-based config.
 */
function getDriver() {
  if (!_driver) {
    const { cognodb } = getConfig();
    _driver = neo4j.driver(
      cognodb.uri,
      neo4j.auth.basic(cognodb.username, cognodb.password),
      {
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 30_000, // 30 s
        connectionTimeout: 30_000,
        logging: {
          level: 'warn',
          logger: (level, message) => logger[level]?.(message),
        },
      }
    );
  }
  return _driver;
}

/**
 * Verifies the connection to CognoDB is alive.
 * @param {import('neo4j-driver').Driver} driver
 * @throws {Error} If the database is unreachable.
 */
async function verifyConnection(driver) {
  const session = driver.session();
  try {
    const result = await session.run('RETURN 1 AS ping');
    const ping = result.records[0]?.get('ping');
    if (neo4j.isInt(ping) && ping.toNumber() !== 1) {
      throw new Error('Unexpected ping response from CognoDB');
    }
  } catch (err) {
    throw new Error(`Cannot reach CognoDB Cloud: ${err.message}`);
  } finally {
    await session.close();
  }
}

/**
 * Runs a read query with parameterized Cypher.
 * Handles session lifecycle automatically.
 * @param {string} cypher  Parameterized Cypher query string.
 * @param {object} params  Query parameters.
 * @returns {Promise<import('neo4j-driver').Record[]>}
 */
async function readQuery(cypher, params = {}) {
  const session = getDriver().session({ defaultAccessMode: neo4j.session.READ });
  try {
    const result = await session.run(cypher, params);
    return result.records;
  } finally {
    await session.close();
  }
}

/**
 * Runs a write query with parameterized Cypher.
 * @param {string} cypher
 * @param {object} params
 * @returns {Promise<import('neo4j-driver').Record[]>}
 */
async function writeQuery(cypher, params = {}) {
  const session = getDriver().session({ defaultAccessMode: neo4j.session.WRITE });
  try {
    const result = await session.run(cypher, params);
    return result.records;
  } finally {
    await session.close();
  }
}

/**
 * Gracefully closes the driver and all open connections.
 */
async function closeDriver() {
  if (_driver) {
    await _driver.close();
    _driver = null;
    logger.info('CognoDB driver closed');
  }
}

/**
 * Converts a Neo4j Integer to a JS number safely.
 */
function toNumber(val) {
  if (neo4j.isInt(val)) return val.toNumber();
  if (typeof val === 'number') return val;
  return 0;
}

module.exports = {
  getDriver,
  verifyConnection,
  readQuery,
  writeQuery,
  closeDriver,
  toNumber,
};
