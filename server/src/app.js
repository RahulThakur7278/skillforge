/**
 * Express Application Factory
 *
 * Configures middleware, routes, health checks, and error handling.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { getConfig } = require('./config/env');
const { verifyConnection, getDriver } = require('./config/database');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const path = require('path');

function createApp() {
  const app = express();
  const { server } = getConfig();

  /* ---- Security ---- */
  app.use(helmet());
  app.use(cors({
    origin: server.corsOrigin,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  }));

  /* ---- Rate limiting ---- */
  app.use('/api/', rateLimit({
    windowMs: 60 * 1000,  // 1 minute
    max: 100,             // 100 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: { message: 'Too many requests — slow down' } },
  }));

  /* ---- Body parsing ---- */
  app.use(express.json({ limit: '1mb' }));

  /* ---- Request logging ---- */
  if (server.nodeEnv !== 'test') {
    app.use(morgan('short'));
  }

  /* ---- Health check ---- */
  app.get('/api/health', async (_req, res) => {
    try {
      await verifyConnection(getDriver());
      res.json({
        success: true,
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      res.status(503).json({
        success: false,
        status: 'unhealthy',
        database: 'disconnected',
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    }
  });

  /* ---- API routes ---- */
  app.use('/api', routes);

  /* ---- 404 handler ---- */
  app.use('/api/*', (_req, res) => {
    res.status(404).json({ success: false, error: { message: 'Endpoint not found' } });
  });

  /* ---- Serve React Frontend (Production) ---- */
  if (server.nodeEnv === 'production') {
    const clientBuildPath = path.join(__dirname, '../../client/dist');
    app.use(express.static(clientBuildPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  }

  /* ---- Global error handler (must be last) ---- */
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
