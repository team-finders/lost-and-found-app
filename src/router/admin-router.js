import { Router } from 'express';
import HttpErrors from 'http-errors';
import Admin from '../model/admin';
import basicAuthMiddleware from '../lib/middleware/basic-auth-middleware';
import logger from '../lib/logger';

const adminRouter = new Router();

adminRouter.post('/api/admin/create', (request, response, next) => {
  Admin.init()
    .then(() => {
      return Admin.create(request.body.username, request.body.email, request.body.password, request.body.firstName, request.body.lastName, request.body.phoneNumber);
    })
    .then((admin) => {
      delete request.body.password;
      logger.log(logger.INFO, 'AUTH ROUTER to /api/signup: creating token');
      return admin.createToken();
    })
    .then((token) => {
      logger.log(logger.INFO, `AUTH ROUTER to /api/signup: sending a 200 code and a token ${token}`);
      return response.json({ token });
    })
    .catch(next);
});

adminRouter.get('/api/admin/login', basicAuthMiddleware, (request, response, next) => {
  if (!request.admin) return next(new HttpErrors(400, 'AUTH ROUTER to /api/login: invalid request'));
  return request.admin.createToken()
    .then((token) => {
      logger.log(logger.INFO, `AUTH ROUTER to /api/login - responding with 200 status code and token ${token}`);
      return response.json({ token });  
    })
    .catch(next);
});

export default adminRouter;
