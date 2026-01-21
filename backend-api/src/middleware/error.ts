import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

/**
 * Error handler middleware
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // eslint-disable-next-line no-console
  console.error('Error:', err);

  const statusCode = (err as any).statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: 'INTERNAL_ERROR',
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * 404 handler middleware
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.path}`,
      code: 'NOT_FOUND',
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Request logging
 */
export const requestLogger = morgan((tokens: any, req: any, res: any) => {
  const timestamp = new Date().toISOString();
  const method = tokens.method(req, res);
  const path = tokens.url(req, res);
  const status = tokens.status(req, res);
  const responseTime = tokens['response-time'](req, res);

  return `${timestamp} ${method} ${path} ${status} ${responseTime}ms`;
});
