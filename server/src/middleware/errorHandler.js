/**
 * Global Error Handler Middleware
 *
 * Catches all errors thrown in route handlers and returns
 * consistent JSON error responses. Maps known CognoDB/Neo4j
 * error codes to appropriate HTTP status codes.
 */

const { logger } = require('../utils/logger');

// Neo4j / CognoDB error code mappings
const NEO4J_ERROR_MAP = {
  'Neo.ClientError.Statement.SyntaxError': { status: 400, message: 'Invalid query syntax' },
  'Neo.ClientError.Schema.ConstraintValidationFailed': { status: 409, message: 'Constraint violation' },
  'Neo.ClientError.Security.Unauthorized': { status: 401, message: 'Database authentication failed' },
  'Neo.TransientError.Transaction.DeadlockDetected': { status: 503, message: 'Temporary conflict — retry' },
  ServiceUnavailable: { status: 503, message: 'Database is unreachable' },
  SessionExpired: { status: 503, message: 'Database session expired' },
};

function errorHandler(err, _req, res, _next) {
  // Determine status and message
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_ERROR';

  // Map Neo4j-specific errors
  if (err.code && NEO4J_ERROR_MAP[err.code]) {
    const mapped = NEO4J_ERROR_MAP[err.code];
    status = mapped.status;
    message = mapped.message;
  }

  // Connection-related errors → 503
  if (
    err.message?.includes('Could not perform discovery') ||
    err.message?.includes('connection refused') ||
    err.message?.includes('ECONNREFUSED') ||
    err.message?.includes('Cannot reach CognoDB') ||
    err.constructor?.name === 'ServiceUnavailable'
  ) {
    status = 503;
    message = 'CognoDB Cloud is currently unreachable. Please try again later.';
    code = 'DATABASE_UNAVAILABLE';
  }

  // Log server errors; skip expected client errors
  if (status >= 500) {
    logger.error(`[${status}] ${err.message}`, err.stack || '');
  } else {
    logger.warn(`[${status}] ${message}`);
  }

  res.status(status).json({
    success: false,
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}

module.exports = { errorHandler };
