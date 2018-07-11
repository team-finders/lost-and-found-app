'use strict';

import superagent from 'superagent';
import faker from 'faker'; /*eslint-disable-line*/
import { startServer, stopServer } from '../lib/server';
import { createItemMock, removeAllResources } from './lib/item-mock';
import { createAdminMock } from './lib/admin-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api`;

describe('ITEM ROUTER', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeAllResources);

  let testAccount;
  beforeEach(async () => {
    jest.setTimeout(20000);
    try {
      testAccount = await createItemMock();
    } catch (err) {
      console.log(err);  /* eslint-disable-line */
    }
    return undefined;
  });

  describe('Account POST requests', () => {
    test('POST 200 to /api/items', async () => {
      const mockItem = {
        postType: 'Lost',
        itemType: 'water bottle',
      };
      try {
        const returnItem = await superagent.post(`${apiUrl}/items`)
          .auth(testAccount.account.username, testAccount.originalRequest.password)
          .set('Authorization', `Bearer ${testAccount.token}`)
          .field(mockItem)
          .attach('image', `${__dirname}/assets/orange-water-bottle.jpg`);
        expect(returnItem.status).toEqual(200);
        expect(returnItem.body.postType).toEqual('Lost');
        expect(returnItem.body.itemType).toEqual('water bottle');
        expect(returnItem.body._id).toBeTruthy();
        expect(returnItem.body.imageUrl).toBeTruthy();
      } catch (err) {
        expect(err).toEqual('something bad');
      }
    });

    test('POST: 400 for no postType', async () => {
      const mockItem = {
        itemType: 'water bottle',
      };
    
      try {
        const returnItem = await superagent.post(`${apiUrl}/items`)
          .auth(testAccount.account.username, testAccount.originalRequest.password)
          .set('Authorization', `Bearer ${testAccount.token}`)
          .send(mockItem);
        throw returnItem;
      } catch (err) {
        expect(err.status).toEqual(400);
      }
    });

    test('POST: 401 for unauthorized user', async () => {
      const mockItem = {
        postType: 'Lost',
        itemType: 'water bottle',
      };
      try {
        const returnItem = await superagent.post(`${apiUrl}/items`)
          .auth(testAccount.account.username, 'IncorrectPassword')
          .send(mockItem);
        throw returnItem;
      } catch (err) {
        expect(err.status).toEqual(401);
      }
    });
  });

  describe('Admin POST requests', () => {
    let testAdmin;

    beforeEach(async () => {
      try {
        testAdmin = await createAdminMock();
      } catch (err) {
        console.log(err);
      }
      return undefined;
    });

    test('POST 200 to /api/items', async () => {
      const mockItem = {
        postType: 'Lost',
        itemType: 'water bottle',
      };
      try {
        const returnItem = await superagent.post(`${apiUrl}/items`)
          .auth(testAdmin.account.username, testAdmin.originalRequest.password)
          .set('Authorization', `Bearer ${testAdmin.token}`)
          .field(mockItem)
          .attach('image', `${__dirname}/assets/orange-water-bottle.jpg`);
        expect(returnItem.status).toEqual(200);
        expect(returnItem.body.postType).toEqual('Lost');
        expect(returnItem.body.itemType).toEqual('water bottle');
        expect(returnItem.body._id).toBeTruthy();
        expect(returnItem.body.imageUrl).toBeTruthy();
      } catch (err) {
        expect(err).toEqual('something bad');
      }
    });

    test('POST: 400 for no postType', async () => {
      const mockItem = {
        itemType: 'water bottle',
      };
    
      try {
        const returnItem = await superagent.post(`${apiUrl}/items`)
          .auth(testAdmin.account.username, testAdmin.originalRequest.password)
          .set('Authorization', `Bearer ${testAdmin.token}`)
          .send(mockItem);
        throw returnItem;
      } catch (err) {
        expect(err.status).toEqual(400);
      }
    });

    test('POST: 401 for unauthorized user', async () => {
      const mockItem = {
        postType: 'Lost',
        itemType: 'water bottle',
      };
      try {
        const returnItem = await superagent.post(`${apiUrl}/items`)
          .auth(testAdmin.account.username, 'IncorrectPassword')
          .send(mockItem);
        throw returnItem;
      } catch (err) {
        expect(err.status).toEqual(401);
      }
    });
  });

  describe('Account GET requests', () => {
    test('GET: 200 for successful retrieval', async () => {
      try {
        const returnItem = await superagent.get(`${apiUrl}/items/${testAccount.item._id}`)
          .auth(testAccount.account.username, testAccount.originalRequest.password)
          .set('Authorization', `Bearer ${testAccount.token}`);
        expect(returnItem.status).toEqual(200);
      } catch (err) { 
        console.log(err);  /* eslint-disable-line */
      }
    });

    test('GET: 404 for item NOT FOUND', async () => {
      try {
        const returnItem = await superagent.get(`${apiUrl}/items/badId`)
          .auth(testAccount.account.username, testAccount.originalRequest.password)
          .set('Authorization', `Bearer ${testAccount.token}`);

        throw returnItem;
      } catch (err) { 
        expect(err.status).toEqual(404);
      }
    });
  });

  describe('Account DELETE requests', () => {
    test('DELETE 200 for successful deletion', async () => {
      try {
        const returnItem = await superagent.delete(`${apiUrl}/items/${testAccount.item._id}`)
          .auth(testAccount.account.username, testAccount.originalRequest.password)
          .set('Authorization', `Bearer ${testAccount.token}`);
        expect(returnItem.status).toEqual(200);
      } catch (err) { 
        expect(err).toEqual('foo');
      }
    });

    test('GET: 404 for item NOT FOUND', async () => {
      try {
        const returnItem = await superagent.delete(`${apiUrl}/items/badId`)
          .auth(testAccount.account.username, testAccount.originalRequest.password)
          .set('Authorization', `Bearer ${testAccount.token}`);

        throw returnItem;
      } catch (err) { 
        expect(err.status).toEqual(404);
      }
    });
  });

  describe('Account PUT requests', () => {
    test('PUT 200 for successful retrieval', async () => {
      try {
        const newItem = {
          color: 'black',
          itemType: 'clothing',
        };
        console.log(testAccount.item);
        const returnItem = await superagent.put(`${apiUrl}/items/${testAccount.item._id}`)
          .auth(testAccount.account.username, testAccount.originalRequest.password)
          .set('Authorization', `Bearer ${testAccount.token}`)
          .send(newItem);
        expect(returnItem.status).toEqual(200);
        expect(returnItem.body.color).toEqual('black');
      } catch (err) { 
        console.log(err);
      }
    });

    test('GET: 404 for item NOT FOUND', async () => {
      try {
        const newItem = {
          color: 'black',
        };

        const returnItem = await superagent.put(`${apiUrl}/items/badId`)
          .auth(testAccount.account.username, testAccount.originalRequest.password)
          .set('Authorization', `Bearer ${testAccount.token}`)
          .send(newItem);

        throw returnItem;
      } catch (err) { 
        expect(err.status).toEqual(404);
      }
    });
  });
});
