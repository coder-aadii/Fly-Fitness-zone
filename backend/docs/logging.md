# Logging System

This document explains the logging system used in the Fly Fitness Zone backend.

## Overview

The backend uses a simple logging utility that respects the `NODE_ENV` environment variable. In production mode, only warnings, errors, and critical logs are shown, while in development mode, all logs are shown.

## Log Levels

The logging system has five log levels:

1. **Debug** (`logger.debug`): Detailed information for debugging purposes. Only shown in development mode.
2. **Info** (`logger.info`): General information about the application's operation. Only shown in development mode.
3. **Warn** (`logger.warn`): Warning messages that don't prevent the application from functioning. Always shown.
4. **Error** (`logger.error`): Error messages that indicate a problem. Always shown.
5. **Critical** (`logger.critical`): Critical error messages that require immediate attention. Always shown.

## Usage

```javascript
const logger = require('../utils/logger');

// Debug level - only shown in development
logger.debug('Detailed debugging information');

// Info level - only shown in development
logger.info('General information about operation');

// Warning level - always shown
logger.warn('Warning message');

// Error level - always shown
logger.error('Error message');

// Critical level - always shown
logger.critical('Critical error message');
```

## Environment Configuration

The logging system uses the `NODE_ENV` environment variable to determine whether to show debug and info logs. If `NODE_ENV` is set to `'production'`, debug and info logs are suppressed.

You can set the `NODE_ENV` variable in your `.env` file:

```
NODE_ENV=production
```

Or you can use the provided script to set it:

```bash
npm run production
```

## Best Practices

1. **Use the Appropriate Log Level**: Choose the log level that best matches the importance of your message.
2. **Don't Log Sensitive Information**: Never log passwords, tokens, or other sensitive information.
3. **Be Descriptive**: Include enough information in your log messages to understand what's happening.
4. **Include Context**: When logging errors, include relevant context such as function name, input values, etc.
5. **Use Structured Logging**: For complex data, use structured logging (e.g., `logger.info('User data:', userData)`).

## Production Deployment

When deploying to production, you should:

1. Set `NODE_ENV` to `'production'` in your `.env` file or use the `npm run production` script.
2. Ensure all sensitive information is removed from logs.
3. Consider setting up a proper logging service for production environments.

## Future Enhancements

In the future, the logging system could be enhanced to:

1. Write logs to files
2. Integrate with external logging services
3. Add more log levels
4. Add log rotation
5. Add log filtering