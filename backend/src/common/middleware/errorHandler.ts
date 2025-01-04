import type { ErrorRequestHandler } from 'express';

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
  res.locals.err = err;
  next(err);
};

export default addErrorToRequestLog;
