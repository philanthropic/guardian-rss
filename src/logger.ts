import { createLogger, transports, format, Logger } from 'winston';

const { combine, colorize, printf, timestamp } = format;

const logFormat = printf(
  info => `[${info.timestamp}] ${info.level}: ${info.message}`
);

const logger: Logger = createLogger({
  level: 'info',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [
    new transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: combine(colorize(), logFormat),
    }),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
});

export default logger;
