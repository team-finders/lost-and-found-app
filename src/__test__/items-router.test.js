'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import { createAccountMock, removeAccountMock } from './lib/accountMock';
import { createItemMock, removeItemMock } from './lib/item-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api`;

describe('ITEM ROUTER', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeItemMock);

  let testItem;

  beforeEach(async () => {
    try {
      testItem = await createItemMock();
    } catch (err) {
      console.log(err);
    }
    return undefined;
  }
  // test('POST 200 to /api/items', async () => {
    // const mockItem = {
      // username: faker.internet.userName(),
      // password: faker.lorem.words(5),
      // email: faker.internet.email(),
      // firstName: faker.name.firstName(),
      // lastName: faker.name.lastName(),
    // };
    // try {
      // const returnItem = await superagent.post(`${apiUrl}/items`)
        // .send(mockItem);
      // console.log(returnItem.body.token);
      // expect(returnItem.status).toEqual(200);
      // expect(returnItem.body.token).toBeTruthy();
    // } catch (err) {
      // expect(err).toEqual('something bad');
    // }
  // });
// })
});