'use strict';

import logger from '../logger';

export default (request, response, next) => {
  logger.log(logger.INFO, `Processing ${request.method} on ${request.url}`);
  return next();
};
