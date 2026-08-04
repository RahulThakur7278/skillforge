/**
 * Structured Logger
 *
 * Lightweight logger with timestamp and level prefixes.
 * In production, swap for Winston / Pino if needed.
 */

const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL || 'info'] ?? LOG_LEVELS.info;

function fmt(level) {
  const ts = new Date().toISOString();
  return `[${ts}] [${level.toUpperCase()}]`;
}

const logger = {
  error: (...args) => currentLevel >= LOG_LEVELS.error && console.error(fmt('error'), ...args),
  warn: (...args) => currentLevel >= LOG_LEVELS.warn && console.warn(fmt('warn'), ...args),
  info: (...args) => currentLevel >= LOG_LEVELS.info && console.log(fmt('info'), ...args),
  debug: (...args) => currentLevel >= LOG_LEVELS.debug && console.log(fmt('debug'), ...args),
};

module.exports = { logger };
