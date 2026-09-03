import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Prisma unique constraint
  if ((err as { code?: string }).code === 'P2002') {
    res.status(409).json({
      success: false,
      message: 'A record with this information already exists.',
    });
    return;
  }

  logger.error(`Unhandled error on ${req.method} ${req.path}: ${err.message}`, { stack: err.stack });

  res.status(500).json({
    success: false,
    message: err.message || 'An internal server error occurred',
  });
}
