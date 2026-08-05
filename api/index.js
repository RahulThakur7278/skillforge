const { createApp } = require('../server/src/app');
const { validateEnv } = require('../server/src/config/env');

// Validate environment variables (throws if missing)
validateEnv();

// Create and export the Express app for Vercel Serverless Functions
const app = createApp();

module.exports = app;
