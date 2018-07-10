import HttpErrors from 'http-errors';
import Admin from '../../model/admin';

export default (request, response, next) => {
  if (!request.headers.authorization) return next(new HttpErrors(400, 'AUTH MIDDLEWARE - invalid request'));
  
  const authHeader = request.headers.authorization.split('Basic ')[1];
  if (!authHeader) return next(new HttpErrors(400, 'AUTH MIDDLEWARE - invalid request'));

  const authHeaderString = Buffer.from(authHeader, 'base64').toString();

  const [username, password] = authHeaderString.split(':');
  if (!username || !password) return next(new HttpErrors(400, 'AUTH MIDDLEWARE - invalid request'));
  return Admin.findOne({ username })
    .then((account) => {
      if (!account) return next(new HttpErrors(400, 'AUTH MIDDLEWARE - invalid request'));
      return account.verifyPassword(password);
    })
    .then((account) => {
      request.admin = account;
      return next();
    })
    .catch(next);
};
