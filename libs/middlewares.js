import express from 'express';

/**
 * Adds middleware to a given express application.
 * @param {express.Express} API the express application.
 */
const injectMiddlewares = (api) => {
  api.use(express.json({ limit: '200mb' }));
};

export default injectMiddlewares;
