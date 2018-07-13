import { Router } from 'express';
import HttpErrors from 'http-errors';
import Account from '../model/account';
import basicAuthMiddleware from '../lib/middleware/basic-auth-middleware';
import logger from '../lib/logger';
import Admin from '../model/admin';

const authRouter = new Router();

authRouter.post('/api/signup', (request, response, next) => {
  Account.init()
    .then(() => {
      return Admin.find({});
    })
    .then((admin) => {
      return admin[0]._id;
    })
    .then((locationId) => {
      return Account.create(request.body.username, request.body.password, request.body.email, request.body.firstName, request.body.lastName, locationId, request.body.phoneNumber);
    })
    .then((account) => {
      delete request.body.password;
      logger.log(logger.INFO, 'AUTH ROUTER to /api/signup: creating token');
      return account.createToken();
    })
    .then((token) => {
      logger.log(logger.INFO, `AUTH ROUTER to /api/signup: sending a 200 code and a token ${token}`);
      return response.json({ token });
    })
    .catch(next);
});

authRouter.get('/api/login', basicAuthMiddleware, (request, response, next) => {
  if (!request.account) return next(new HttpErrors(400, 'AUTH ROUTER to /api/login: invalid request'));
  return request.account.createToken()
    .then((token) => {
      logger.log(logger.INFO, `AUTH ROUTER to /api/login - responding with 200 status code and token ${token}`);
      return response.json({ token });  
    })
    .catch(next);
});

export default authRouter;
