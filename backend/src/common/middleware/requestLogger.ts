import type { NextFunction, Request, Response } from 'express';
import pino from 'pino';

const logger = pino({ name: 'Req Logger' });

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime();

  res.on('finish', () => {
    const elapsedTime = process.hrtime(startTime);
    const elapsedMs = ((elapsedTime[0] * 1e9 + elapsedTime[1]) / 1e6).toFixed(
      0
    );

    const logLevel =
      res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

    const method = req.method;
    const url = req.originalUrl || req.url;
    const statusCode = res.statusCode;
    const responseTime = `${elapsedMs}ms`;

    const logMessage = `${method}: ${statusCode}, "${url}", ${responseTime}`;

    logger[logLevel](logMessage);
  });

  next();
};

export default requestLogger;
