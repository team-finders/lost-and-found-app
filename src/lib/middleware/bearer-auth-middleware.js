'use strict';

import HttpErrors from 'http-errors';
import jsonWebToken from 'jsonwebtoken';
import { promisify } from 'util';
import Account from '../../model/account';
import Admin from '../../model/admin';

const jwtVerify = promisify(jsonWebToken.verify);

export default (req, res, next) => {
  if (!req.headers.authorization) return next(new HttpErrors(400, 'BEARER AUTH - No headers auth'));

  const token = req.headers.authorization.split('Bearer ')[1];
  if (!token) return next(new HttpErrors(401, 'Bad token'));
  return jwtVerify(token, process.env.SECRET_KEY)
    .catch((err) => {
      return Promise.reject(new HttpErrors(400, `BEARER AUTH - jsonWebToken error ${JSON.stringify(err)}`));
    })
    .then((decryptedToken) => {
      if (Account.findOne({ tokenSeed: decryptedToken.tokenSeed })) {
        return Account.findOne({ tokenSeed: decryptedToken.tokenSeed })
          .then((account) => {
            req.permissions = 'account';
            req.account = account;
            return next();
          })
          .catch(next);
      }

      if (Admin.findOne({ tokenSeed: decryptedToken.tokenSeed })) {
        return Admin.findOne({ tokenSeed: decryptedToken.tokenSeed })
          .then((account) => {
            req.permissions = 'admin';
            req.account = account;
            return next();
          })
          .catch(next);
      }

      return next(new HttpErrors(404, 'BEARER AUTH - No account found'));
    })
    .catch(next);
};
