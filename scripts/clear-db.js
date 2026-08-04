/**
 * Clear Database Script
 *
 * Removes all nodes and relationships from CognoDB.
 * Run: node scripts/clear-db.js
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const neo4j = require('neo4j-driver');

const URI = process.env.COGNODB_URI;
const USER = process.env.COGNODB_USERNAME || 'cognodb';
const PASS = process.env.COGNODB_PASSWORD;

if (!URI || !PASS) {
  console.error('❌ Missing COGNODB_URI or COGNODB_PASSWORD in .env');
  process.exit(1);
}

async function clear() {
  const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASS));
  const session = driver.session();

  try {
    console.log('🗑️  Clearing all data from CognoDB…');
    await session.run('MATCH (n) DETACH DELETE n');
    console.log('✅ Database cleared.');
  } catch (err) {
    console.error('❌ Failed to clear database:', err.message);
  } finally {
    await session.close();
    await driver.close();
  }
}

clear();
