import { Router } from 'express';
import superagent from 'superagent';
import HttpErrors from 'http-errors';
import crypto from 'crypto';//eslint-disable-line
import jwt from 'jsonwebtoken';//eslint-disable-line
import Account from '../model/account';//eslint-disable-line
import logger from '../lib/logger';

const GOOGLE_OAUTH_URL = 'https://www.googleapis.com/oauth2/v4/token';
const OPEN_ID_URL = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

require('dotenv').config();

const googleOAuthRouter = new Router();

googleOAuthRouter.get('/api/oauth/google', (req, res, next) => {
  if (!req.query.code) {
    logger.log(logger.ERROR, 'DID NOT GET CODE FROM GOOGLE');
    res.redirect(process.env.CLIENT_URL);
    return next(new HttpErrors(500, 'Google OAuth Error'));
  }
  logger.log(logger.INFO, `RECVD CODE FROM GOOGLE AND SENDING IT BACK TO GOOGLE: ${req.query.code}`);

  let accessToken;
  let username;
  let email;
  let password;
  let firstName;
  let lastName;
  let profileImageUrl;
  const cachedUser = true;
  let responseToken;

  return superagent.post(GOOGLE_OAUTH_URL)
    .type('form')
    .send({
      code: req.query.code,
      grant_type: 'authorization_code',
      client_id: process.env.GOOGLE_OAUTH_ID,
      client_secret: process.env.GOOGLE_OAUTH_SECRET,
      redirect_uri: `${process.env.API_URL}/oauth/google`,
    })
    .then((googleTokenResponse) => {
      if (!googleTokenResponse.body.access_token) {
        logger.log(logger.ERROR, 'No token from Google');
        return res.redirect(process.env.CLIENT_URL);
      }
      logger.log(logger.INFO, `RECEIVED GOOGLE ACCESS TOKEN: ${JSON.stringify(googleTokenResponse.body, null, 2)}`);
      accessToken = googleTokenResponse.body.access_token;

      logger.log(logger.INFO, `ACCESS TOKEN RECEIVED: ${JSON.stringify(accessToken)}`);

      return superagent.get(OPEN_ID_URL)
        .set('Authorization', `Bearer ${accessToken}`);
    })
    .then((openIDResponse) => {
      logger.log(logger.INFO, `OPEN ID: ${JSON.stringify(openIDResponse.body, null, 2)}`);
      email = openIDResponse.body.email; // eslint-disable-line
      username = email; 
      password = openIDResponse.body.pass;
      firstName = openIDResponse.body.first_name;
      lastName = openIDResponse.body.last_name;
      profileImageUrl = openIDResponse.body.picture;

      return superagent.get(`${process.env.API_URL}/login`)
        .auth(username, password)
        .withCredentials();
    })
    .then((result) => {
      responseToken = result.body.token;
      const cookieOptions = { maxAge: 7 * 1000 * 60 * 60 * 24 };
      res.cookie('X-38-Token', accessToken, cookieOptions);
      return res.redirect(process.env.CLIENT_URL);
    })
    .catch(() => {
      return superagent.post(`${process.env.API_URL}/signup`)
        .send({ username, email, password })
        .withCredentials();
    })
    .then((result) => {
      if (!cachedUser) {
        responseToken = result.body.token;
        return superagent.post(`${process.env.API_URL}/profiles`)
          .set('Authorization', `Bearer ${responseToken}`)
          .send({ firstName, lastName, profileImageUrl });
      }
      return undefined;
    })
    .then(() => {
      if (!cachedUser) {
        const cookieOptions = { maxAge: 7 * 1000 * 60 * 60 * 24 };
        res.cookie('X-401d25-Token', responseToken, cookieOptions);
        return res.redirect(process.env.CLIENT_URL);
      }
      return undefined;
    })
    .catch(next);
});

export default googleOAuthRouter;
