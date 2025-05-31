// utils/logger.js
/**
 * Simple logging utility that respects the NODE_ENV environment variable
 * In production, only warnings, errors, and critical logs are shown
 * In development, all logs are shown
 */

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Log levels
 * 0 = debug (only in development)
 * 1 = info (only in development)
 * 2 = warn (always shown)
 * 3 = error (always shown)
 * 4 = critical (always shown)
 */

/**
 * Debug level log - only shown in development
 * @param {...any} args - Arguments to log
 */
const debug = (...args) => {
  if (!isProduction) {
    console.debug('[DEBUG]', ...args);
  }
};

/**
 * Info level log - only shown in development
 * @param {...any} args - Arguments to log
 */
const info = (...args) => {
  if (!isProduction) {
    console.info('[INFO]', ...args);
  }
};

/**
 * Warning level log - always shown
 * @param {...any} args - Arguments to log
 */
const warn = (...args) => {
  console.warn('[WARN]', ...args);
};

/**
 * Error level log - always shown
 * @param {...any} args - Arguments to log
 */
const error = (...args) => {
  console.error('[ERROR]', ...args);
};

/**
 * Critical level log - always shown
 * @param {...any} args - Arguments to log
 */
const critical = (...args) => {
  console.error('[CRITICAL]', ...args);
};

module.exports = {
  debug,
  info,
  warn,
  error,
  critical
};