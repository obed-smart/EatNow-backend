import pino from 'pino';

let logger;


if (process.env.NODE_ENV !== 'production') {
  logger = pino({
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, singleLine: false },
    },
  });
} else {
  logger = pino({ level: 'info' });
}

export default logger;
