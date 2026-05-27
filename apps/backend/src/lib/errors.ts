import { Response, NextFunction } from 'express';

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const handleErrors = (fn: Function) => (req: any, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
