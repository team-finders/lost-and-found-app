import { Router } from 'express';
import HttpErrors from 'http-errors';
import Account from '../model/account';
import basicAuthMiddleware from '../lib/middleware/basic-auth-middleware';
import logger from '../lib/logger';
import bearerAuthMiddleware from '../lib/middleware/bearer-auth-middleware'; /*eslint-disable-line*/

const authRouter = new Router();

authRouter.post('/api/signup', (request, response, next) => {
  Account.init()
    .then(() => {
      return Account.create(request.body.username, request.body.email, request.body.password);
    })
    .then((account) => {
      console.log(account);
      delete request.body.password;
      logger.log(logger.INFO, 'auth-router /api/signup: creating token');
      return account.createToken();
    })
    .then((token) => {
      logger.log(logger.INFO, `AUTH-ROUTER /api/signup: sending a 200 code and a token ${token}`);
      return response.json({ token });
    })
    .catch(next);
});

authRouter.get('/api/login', basicAuthMiddleware, (request, response, next) => {
  if (!request.account) return next(new HttpErrors(400, 'AUTH-ROUTER: invalid request'));
  console.log(request.account);
  return request.account.createToken()
    .then((token) => {
      logger.log(logger.INFO, `AUTH-ROUTER /api/login - responding with 200 status code and token ${token}`);
      return response.json({ token });  
    })
    .catch(next);
});

export default authRouter;
