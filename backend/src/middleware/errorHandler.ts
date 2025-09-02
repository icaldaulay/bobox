import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../models/Unit';

// Error handling middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  const response: ApiResponse<never> = {
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message || 'Internal server error'
  };

  res.status(err.status || 500).json(response);
};

// 404 Not Found middleware
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const response: ApiResponse<never> = {
    success: false,
    error: `Route ${req.originalUrl} not found`
  };

  res.status(404).json(response);
};

// Request logging middleware
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};
