'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import { createAccountMock, removeAccountMock } from './lib/accountMock';

const apiUrl = `http://localhost:${process.env.PORT}/api`;

describe('AUTH router', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeAccountMock);

  let testAccount;

  beforeEach(async () => {
    try {
      testAccount = await createAccountMock();
    } catch (err) {
      console.log(err);
    }
    return undefined;
  });

  test('POST 200 to /api/signup', async () => {
    const mockAccount = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: 'hahahaha',
    };
    try {
      const returnAccount = await superagent.post(`${apiUrl}/signup`)
        .send(mockAccount);
      console.log(returnAccount.body.token);
      expect(returnAccount.status).toEqual(200);
      expect(returnAccount.body.token).toBeTruthy();
    } catch (err) {
      expect(err).toEqual('something bad');
    }
  });

  test('POST 400 for no username', async () => {
    const mockAccount = {
      email: faker.internet.email(),
      password: 'hahahaha',
    };
    try {
      const returnAccount = await superagent.post(`${apiUrl}/signup`)
        .send(mockAccount);
      throw returnAccount;
    } catch (err) {
      expect(err.status).toEqual(400);
    }
  });

  test('POST 400 for no email', async () => {
    const mockAccount = {
      username: faker.internet.userName(),
      password: 'hahahaha',
    };
    try {
      const returnAccount = await superagent.post(`${apiUrl}/signup`)
        .send(mockAccount);
      throw returnAccount;
    } catch (err) {
      expect(err.status).toEqual(400);
    }
  });

  test('POST 409 for conflicting username', async () => {
    const mockAccount = {
      username: testAccount.account.username,
      email: faker.internet.email(),
      password: 'hahahaha',
    };
    try {
      const returnAccount = await superagent.post(`${apiUrl}/signup`)
        .send(mockAccount);
      throw returnAccount;
    } catch (err) {
      expect(err.status).toEqual(409);
    }
  });

  test('POST 409 for conflicting email', async () => {
    const mockAccount = {
      username: faker.internet.userName(),
      email: testAccount.account.email,
      password: 'hahahaha',
    };
    try {
      const returnAccount = await superagent.post(`${apiUrl}/signup`)
        .send(mockAccount);
      throw returnAccount;
    } catch (err) {
      expect(err.status).toEqual(409);
    }
  });
});
