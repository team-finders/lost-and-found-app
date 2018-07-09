'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import { createAccountMock, removeAccountMock } from './lib/accountMock';
// import { createItemMock, removeItemMock } from './lib/item-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api`;

describe('ITEM ROUTER', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeAccountMock);

  // let testItem;
  let testAccount;
  beforeEach(async () => {
    try {
      // testItem = await createItemMock();
      testAccount = await createAccountMock();
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
        .auth(testAccount.account.username, testAccount.originalRequest.password)
        .set('Authorization', `Bearer ${testAccount.token}`)
        .send(mockItem);
      expect(returnItem.status).toEqual(200);
      expect(returnItem.body.postType).toEqual('Lost');
      expect(returnItem.body.itemType).toEqual('water bottle');
      expect(returnItem.body._id).toBeTruthy();
    } catch (err) {
      expect(err).toEqual('something bad');
    }
  });
});
