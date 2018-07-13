'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import { createAccountMock, removeAccountMock } from './lib/accountMock';
import { createAdminMock } from './lib/admin-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api`;

describe('AUTH router', () => {
  beforeAll(async () => {
    startServer();
    try {
      const admin = await createAdminMock(); //eslint-disable-line
    } catch (err) {
      console.log(err); //eslint-disable-line
    }
  });
  afterAll(stopServer);
  afterEach(removeAccountMock);

  let testAccount;

  beforeEach(async () => {
    try {
      testAccount = await createAccountMock();
    } catch (err) {
      console.log(err); /* eslint-disable-line */
    }
    return undefined;
  });

  describe('ACCOUNT POST REQUESTS', () => {
    test('ACCOUNT ROUTER POST: 200 to /api/signup', async () => {
      const mockAccount = {
        username: faker.internet.userName(),
        password: faker.lorem.words(5),
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.random.number(),
      };
      try {
        const returnAccount = await superagent.post(`${apiUrl}/signup`)
          .send(mockAccount);
        expect(returnAccount.status).toEqual(200);
        expect(returnAccount.body.token).toBeTruthy();
      } catch (err) {
        expect(err).toEqual('something bad');
      }
    });
  
    test('ACCOUNT ROUTER POST: 400 for no username', async () => {
      const mockAccount = {
        password: faker.lorem.words(5),
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.random.number(),
      };
      try {
        const returnAccount = await superagent.post(`${apiUrl}/signup`)
          .send(mockAccount);
        throw returnAccount;
      } catch (err) {
        expect(err.status).toEqual(400);
      }
    });
  
    test('ACCOUNT ROUTER POST: 400 for no email', async () => {
      const mockAccount = {
        username: faker.internet.userName(),
        password: faker.lorem.words(5),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.random.number(),
      };
      try {
        const returnAccount = await superagent.post(`${apiUrl}/signup`)
          .send(mockAccount);
        throw returnAccount;
      } catch (err) {
        expect(err.status).toEqual(400);
      }
    });
  
    test('ACCOUNT ROUTER POST: 409 for conflicting username', async () => {
      const mockAccount = {
        username: testAccount.account.username,
        password: faker.lorem.words(5),
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.random.number(),
      };
      try {
        const returnAccount = await superagent.post(`${apiUrl}/signup`)
          .send(mockAccount);
        throw returnAccount;
      } catch (err) {
        expect(err.status).toEqual(409);
      }
    });
  
    test('ACCOUNT ROUTER POST: 409 for conflicting email', async () => {
      const mockAccount = {
        username: testAccount.account.username,
        password: faker.lorem.words(5),
        email: testAccount.account.email,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.random.number(),
      };
      try {
        const returnAccount = await superagent.post(`${apiUrl}/signup`)
          .send(mockAccount);
        throw returnAccount;
      } catch (err) {
        expect(err.status).toEqual(409);
      }
    });
  
    test('ACCOUNT ROUTER POST: 500 for no password', async () => {
      const mockAccount = {
        username: testAccount.account.username,
        email: testAccount.account.email,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.random.number(),
      };
      try {
        const returnAccount = await superagent.post(`${apiUrl}/signup`)
          .send(mockAccount);
        throw returnAccount;
      } catch (err) {
        expect(err.status).toEqual(400);
      }
    });
  });
  
  describe('ACCOUNT ROUTER GET', () => {
    test('ACCOUNT ROUTER GET: 200 for successful login to /api/login', async () => {
      try {
        const returnAccount = await superagent.get(`${apiUrl}/login`)
          .auth(testAccount.account.username, testAccount.originalRequest.password);
        expect(returnAccount.status).toEqual(200);
        expect(returnAccount.body.token).toBeTruthy();
      } catch (err) {
        expect(err.status).toEqual('BAD GET');
      }
    });
  
    test('ACCOUNT ROUTER GET: 400 for no username', async () => {
      try {
        const returnAccount = await superagent.get(`${apiUrl}/login`)/*eslint-disable-line*/
          .auth(testAccount.originalRequest.password); 
      } catch (err) {
        expect(err.status).toEqual(400);
      }
    });
  
    test('ACCOUNT ROUTER GET: 400 for no password', async () => {
      try {
        const returnAccount = await superagent.get(`${apiUrl}/login`)/*eslint-disable-line*/
          .auth(testAccount.originalRequest.username); 
      } catch (err) {
        expect(err.status).toEqual(400);
      }
    });
  
  //   test('GET 401 for wrong password', async () => {
  //     try {
  //       const returnAccount = await superagent.get(`${apiUrl}/login`)
  //         .auth(testAccount.originalRequest.username, 'randomPassword');
  //     } catch (err) {
  //       expect(err.status).toEqual(401);
  //     }
  //   });
  // });
  });
});
