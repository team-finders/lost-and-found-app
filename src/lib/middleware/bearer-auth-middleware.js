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

  let tokenCache;

  return jwtVerify(token, process.env.SECRET_KEY)
    .catch((err) => {
      return Promise.reject(new HttpErrors(400, `BEARER AUTH - jsonWebToken error ${JSON.stringify(err)}`));
    })
    .then((decryptedToken) => {
      tokenCache = decryptedToken.tokenSeed;
      return Account.findOne({ tokenSeed: tokenCache });
    })
    .then((account) => {
      if (!account) {
        return Admin.findOne({ tokenSeed: tokenCache })
          .then((admin) => {
            console.log(admin);
            req.permissions = 'admin';
            req.account = admin;
            return next();
          })
          .catch(next);
      }
      req.permissions = 'account';
      req.account = account;
      return next();
    })
    .catch(next);
};
