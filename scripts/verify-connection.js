/**
 * Verify CognoDB Connection
 *
 * Quick health check script.
 * Run: node scripts/verify-connection.js
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const neo4j = require('neo4j-driver');

const URI = process.env.COGNODB_URI;
const USER = process.env.COGNODB_USERNAME || 'cognodb';
const PASS = process.env.COGNODB_PASSWORD;

if (!URI || !PASS) {
  console.error('❌ Missing COGNODB_URI or COGNODB_PASSWORD');
  process.exit(1);
}

async function verify() {
  console.log(`🔌 Connecting to: ${URI}`);
  const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASS));
  const session = driver.session();

  try {
    const result = await session.run('RETURN 1 AS ping');
    const ping = result.records[0].get('ping');
    console.log(`✅ Connection successful! (ping=${ping})`);

    const countResult = await session.run('MATCH (n) RETURN count(n) AS nodeCount');
    const count = countResult.records[0].get('nodeCount');
    console.log(`📊 Current node count: ${count}`);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  } finally {
    await session.close();
    await driver.close();
  }
}

verify();
