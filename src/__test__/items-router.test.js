'use strict';

import superagent from 'superagent';
import faker from 'faker'; /*eslint-disable-line*/
import { startServer, stopServer } from '../lib/server';
import { createItemMock, removeAllResources } from './lib/item-mock';
import { createAdminMock } from './lib/admin-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api`;

describe('ITEMS ROUTER REQUESTS', () => {
  beforeAll(async () => {
    startServer();
    try {
      const admin = await createAdminMock(); //eslint-disable-line
    } catch (err) {
      console.log(err); //eslint-disable-line
    }
  });
  afterAll(stopServer);
  afterEach(removeAllResources);

  let testAccount;
  beforeEach(async () => {
    jest.setTimeout(20000);
    try {
      testAccount = await createItemMock();
    } catch (err) {
      throw err; 
    }
    return undefined;
  });

  describe('POST request to ITEMS', () => {
    test('ITEMS ROUTER POST: Send 200 for successful post to /api/items', async () => {
      const mockItem = {
        postType: 'Lost',
        itemType: 'water bottle',
      };
      try {
        const returnItem = await superagent.post(`${apiUrl}/items`)
          .set('Authorization', `Bearer ${testAccount.token}`)
          .field(mockItem)
          .attach('image', `${__dirname}/assets/orange-water-bottle.jpg`);
        expect(returnItem.status).toEqual(200);
        expect(returnItem.body.postType).toEqual('Lost');
        expect(returnItem.body.itemType).toEqual('water bottle');
        expect(returnItem.body.locationId).toEqual(testAccount.account.locationId.toString());
        expect(returnItem.body._id).toBeTruthy();
        expect(returnItem.body.imageUrl).toBeTruthy();
      } catch (err) {
        expect(err).toEqual('something bad');
      }
    });

    test('ITEMS ROUTER POST: 400 for no postType', async () => {
      const mockItem = {
        itemType: 'water bottle',
      };
    
      try {
        const returnItem = await superagent.post(`${apiUrl}/items`)
          .set('Authorization', `Bearer ${testAccount.token}`)
          .send(mockItem);
        throw returnItem;
      } catch (err) {
        expect(err.status).toEqual(400);
      }
    });

    test('ITEMS ROUTER POST: 401 for unauthorized user', async () => {
      const mockItem = {
        postType: 'Lost',
        itemType: 'water bottle',
      };
      try {
        const returnItem = await superagent.post(`${apiUrl}/items`)
          .set('Authorization', 'Bearer')
          .send(mockItem);
        throw returnItem;
      } catch (err) {
        expect(err.status).toEqual(401);
      }
    });
  });

  describe('ITEMS ROUTER GET requests', () => {
    test('ITEMS ROUTER GET: 200 for successful retrieval of item', async () => {
      try {
        const returnItem = await superagent.get(`${apiUrl}/items/${testAccount.item._id}`)
          .set('Authorization', `Bearer ${testAccount.token}`);
        expect(returnItem.status).toEqual(200);
      } catch (err) { 
        throw err; 
      }
    });

    test('ITEMS ROUTER GET: 404 for item NOT FOUND', async () => {
      try {
        const returnItem = await superagent.get(`${apiUrl}/items/badId`)
          .set('Authorization', `Bearer ${testAccount.token}`);
        throw returnItem;
      } catch (err) { 
        expect(err.status).toEqual(404);
      }
    });
  });

  describe('ITEMS ROUTER DELETE requests', () => {
    test('ITEMS ROUTER DELETE: Send 200 for successful deletion of item', async () => {
      try {
        const returnItem = await superagent.delete(`${apiUrl}/items/${testAccount.item._id}`)
          .set('Authorization', `Bearer ${testAccount.token}`);
        expect(returnItem.status).toEqual(200);
      } catch (err) { 
        expect(err).toEqual('foo');
      }
    });

    test('ITEMS ROUTER DELETE: 404 for item NOT FOUND', async () => {
      try {
        const returnItem = await superagent.delete(`${apiUrl}/items/badId`)
          .set('Authorization', `Bearer ${testAccount.token}`);

        throw returnItem;
      } catch (err) { 
        expect(err.status).toEqual(404);
      }
    });
  });

  describe('ITEMS ROUTER PUT requests', () => {
    test('ITEMS ROUTER PUT: 200 for successful updating of item and return new item', async () => {
      try {
        const newItem = {
          color: 'black',
          itemType: 'clothing',
        };
        const returnItem = await superagent.put(`${apiUrl}/items/${testAccount.item._id}`)
          .set('Authorization', `Bearer ${testAccount.token}`)
          .send(newItem);
        expect(returnItem.status).toEqual(200);
        expect(returnItem.body.color).toEqual('black');
      } catch (err) { 
        console.log(err); /* eslint-disable-line */
      }
    });

    test('ITEMS ROUTER PUT: 404 for item NOT FOUND', async () => {
      try {
        const newItem = {
          color: 'black',
        };

        const returnItem = await superagent.put(`${apiUrl}/items/badId`)
          .set('Authorization', `Bearer ${testAccount.token}`)
          .send(newItem);

        throw returnItem;
      } catch (err) { 
        expect(err.status).toEqual(404);
      }
    });
  });
});
