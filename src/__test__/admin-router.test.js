'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import { createAdminMock, removeAdminMock } from './lib/admin-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api`;

describe('ADMIN ROUTER', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeAdminMock);

  let testAccount;

  beforeEach(async () => {
    try {
      testAccount = await createAdminMock();
    } catch (err) {
      console.log(err); /* eslint-disable-line */
    }
    return undefined;
  });

  describe('ADMIN ROUTER POST', () => {
    test('ADMIN ROUTER POST: 200 to /api/admin/create', async () => {
      const mockAccount = {
        username: faker.internet.userName(),
        password: faker.lorem.words(5),
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.random.number(),
      };
      try {
        const returnAccount = await superagent.post(`${apiUrl}/admin/create`)
          .send(mockAccount);
        expect(returnAccount.status).toEqual(200);
        expect(returnAccount.body.token).toBeTruthy();
      } catch (err) {
        expect(err).toEqual('something bad');
      }
    });
  
    test('ADMIN ROUTER POST: 400 for no username', async () => {
      const mockAccount = {
        password: faker.lorem.words(5),
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.random.number(),
      };
      try {
        const returnAccount = await superagent.post(`${apiUrl}/admin/create`)
          .send(mockAccount);
        throw returnAccount;
      } catch (err) {
        expect(err.status).toEqual(400);
      }
    });
  
    test('ADMIN ROUTER POST: 400 for no email', async () => {
      const mockAccount = {
        username: faker.internet.userName(),
        password: faker.lorem.words(5),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.random.number(),
      };
      try {
        const returnAccount = await superagent.post(`${apiUrl}/admin/create`)
          .send(mockAccount);
        throw returnAccount;
      } catch (err) {
        expect(err.status).toEqual(400);
      }
    });
  
    test('ADMIN ROUTER POST: 409 for conflicting username', async () => {
      const mockAccount = {
        username: testAccount.account.username,
        password: faker.lorem.words(5),
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.random.number(),
      };
      try {
        const returnAccount = await superagent.post(`${apiUrl}/admin/create`)
          .send(mockAccount);
        throw returnAccount;
      } catch (err) {
        expect(err.status).toEqual(409);
      }
    });
  
    test('ADMIN ROUTER POST: 409 for conflicting email', async () => {
      const mockAccount = {
        username: testAccount.account.username,
        password: faker.lorem.words(5),
        email: testAccount.account.email,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.random.number(),
      };
      try {
        const returnAccount = await superagent.post(`${apiUrl}/admin/create`)
          .send(mockAccount);
        throw returnAccount;
      } catch (err) {
        expect(err.status).toEqual(409);
      }
    });
  
    test('ADMIN ROUTER POST: 500 for no password', async () => {
      const mockAccount = {
        username: testAccount.account.username,
        email: testAccount.account.email,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.random.number(),
      };
      try {
        const returnAccount = await superagent.post(`${apiUrl}/admin/create`)
          .send(mockAccount);
        throw returnAccount;
      } catch (err) {
        expect(err.status).toEqual(400);
      }
    });
  });
  
  describe('ADMIN ROUTER GET REQUESTS', () => {
    test('ADMIN ROUTER GET: 200 for successful login to /api/admin/login', async () => {
      try {
        const returnAccount = await superagent.get(`${apiUrl}/admin/login`)
          .auth(testAccount.account.username, testAccount.originalRequest.password);
        expect(returnAccount.status).toEqual(200);
        expect(returnAccount.body.token).toBeTruthy();
      } catch (err) {
        expect(err.status).toEqual('BAD GET');
      }
    });
  
    test('ADMIN ROUTER GET: 400 for no username', async () => {
      try {
        const returnAccount = await superagent.get(`${apiUrl}/admin/login`)/*eslint-disable-line*/
          .auth(testAccount.originalRequest.password); 
      } catch (err) {
        expect(err.status).toEqual(400);
      }
    });
  
    test('ADMIN ROUTER GET: 400 for no password', async () => {
      try {
        const returnAccount = await superagent.get(`${apiUrl}/admin/login`)/*eslint-disable-line*/
          .auth(testAccount.originalRequest.username); 
      } catch (err) {
        expect(err.status).toEqual(400);
      }
    });
  
  //   test('ADMIN ROUTER GET: 401 for wrong password', async () => {
  //     try {
  //       const returnAccount = await superagent.get(`${apiUrl}/admin/login`)
  //         .auth(testAccount.originalRequest.username, 'randomPassword');
  //     } catch (err) {
  //       expect(err.status).toEqual(401);
  //     }
  //   });
  // });
  });
});
