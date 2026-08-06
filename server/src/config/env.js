/**
 * Environment Configuration
 *
 * Validates that all required environment variables are set before the
 * application starts. Fails fast with a clear message on missing config.
 */

import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const REQUIRED_VARS = ['COGNODB_URI', 'COGNODB_USERNAME', 'COGNODB_PASSWORD'];

/**
 * Validates required environment variables and throws if any are missing.
 * @throws {Error} Lists all missing variables at once.
 */
function validateEnv() {
  const missing = REQUIRED_VARS.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n` +
        missing.map((v) => `  • ${v}`).join('\n') +
        `\n\nCopy .env.example to .env and fill in your CognoDB credentials.`
    );
  }
}

/**
 * Returns a typed config object built from process.env.
 */
function getConfig() {
  return {
    cognodb: {
      uri: process.env.COGNODB_URI,
      username: process.env.COGNODB_USERNAME,
      password: process.env.COGNODB_PASSWORD,
    },
    server: {
      port: parseInt(process.env.PORT, 10) || 3001,
      nodeEnv: process.env.NODE_ENV || 'development',
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    },
  };
}

export { validateEnv, getConfig };
