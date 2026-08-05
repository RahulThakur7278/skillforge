const neo4j = require('neo4j-driver');
require('dotenv').config({ path: './.env' });
const URI = process.env.COGNODB_URI;
const USER = process.env.COGNODB_USERNAME || 'cognodb';
const PASS = process.env.COGNODB_PASSWORD;
const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASS));
async function test() {
  const session = driver.session();
  const res1 = await session.run('MATCH path = (start:Role {title: \'Junior Backend Developer\'})-[:LEADS_TO*1..4]->(future:Role) RETURN length(path) as len');
  console.log('Backend paths:', res1.records.length);
  const res2 = await session.run('MATCH path = (start:Role {title: \'Junior Frontend Developer\'})-[:LEADS_TO*1..4]->(future:Role) RETURN length(path) as len');
  console.log('Frontend paths:', res2.records.length);
  const res3 = await session.run('MATCH (r:Role {title: \'Junior Frontend Developer\'})-[:LEADS_TO]->(next) RETURN next.title');
  console.log('Frontend leads to:', res3.records.map(r => r.get(0)));
  const res4 = await session.run('MATCH (r:Role) RETURN count(r) as count');
  console.log('Total roles:', res4.records[0].get('count').toNumber());
  await driver.close();
}
test();
