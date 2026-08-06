import { createApp } from '../server/src/app.js';
import { validateEnv } from '../server/src/config/env.js';

// Validate environment variables for the serverless function
validateEnv();

// Create and export the Express app for Vercel Serverless
const app = createApp();
export default app;
