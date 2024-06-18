/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';

/**
 * Represents the error in this API.
 */
export class APIError extends Error {
  constructor(code, message) {
    super();
    this.code = code || 500;
    this.message = message;
  }
}

/**
 * Applies Basic authentication to the route.
 * @param {Error} err an error object.
 * @param {Request} req an Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next an Express next function.
 */
export const errorResponse = (err, req, res, next) => {
  const defaultMsg = `Failed to process ${req.url}`;

  if (err instanceof APIError) {
    res.status(err.code).json({ error: err.message || defaultMsg });
    return;
  }
  res.status(500).json({
    error: err ? err.message || err.toString() : defaultMsg,
  });
};
