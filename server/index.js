/**
 * SkillForge API — Server Entry Point
 *
 * Bootstraps the Express application, validates the environment,
 * verifies the CognoDB connection, and starts listening.
 */

const { createApp } = require('./src/app');
const { validateEnv } = require('./src/config/env');
const { getDriver, verifyConnection, closeDriver } = require('./src/config/database');
const { logger } = require('./src/utils/logger');

const PORT = process.env.PORT || 3001;

async function main() {
  try {
    /* 1. Validate required environment variables */
    validateEnv();

    /* 2. Verify CognoDB connection */
    logger.info('Connecting to CognoDB Cloud…');
    const driver = getDriver();
    await verifyConnection(driver);
    logger.info('✓ CognoDB connection verified');

    /* 3. Create and start Express app */
    const app = createApp();
    const server = app.listen(PORT, () => {
      logger.info(`✓ SkillForge API running on http://localhost:${PORT}`);
      logger.info(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    /* 4. Graceful shutdown */
    const shutdown = async (signal) => {
      logger.info(`\n${signal} received — shutting down gracefully…`);
      server.close(async () => {
        await closeDriver();
        logger.info('✓ Server stopped');
        process.exit(0);
      });

      // Force exit after 10 s
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10_000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    logger.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

main();
