'use strict';

import logger from '../logger';

export default (error, request, response, next) => { /*eslint-disable-line*/
  logger.log(logger.ERROR, `ERROR MIDDLEWARE: ${JSON.stringify(error.message)}, ${error.status}`);

  if (error.status) {
    logger.log(logger.ERROR, `Responding with a ${error.status} code and message ${error.message}`);
    return response.sendStatus(error.status);
  }

  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes('objectid failed')) {
    logger.log(logger.ERROR, `Responding with a 404 status code ${errorMessage}`);
    return response.sendStatus(404);
  }

  if (errorMessage.includes('validation failed')) {
    logger.log(logger.ERROR, `Responding with a 400 code ${errorMessage}`);
    return response.sendStatus(400);
  }
  if (errorMessage.includes('error with saving account')) {
    logger.log(logger.ERROR, `Responding with a 400 code ${errorMessage}`);
    return response.sendStatus(400);
  }

  if (errorMessage.includes('duplicate key')) {
    logger.log(logger.ERROR, `Responding with a 409 code ${errorMessage}`);
    return response.sendStatus(409);
  }

  if (errorMessage.includes('unauthorized')) {
    logger.log(logger.ERROR, `Responding with a 401 code ${errorMessage}`);
    return response.sendStatus(401);
  }

  logger.log(logger.ERROR, `Responding with a 500 code ${JSON.stringify(error)}`);
  return response.sendStatus(500);
};
