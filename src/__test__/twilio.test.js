'use strict';

import superagent from 'superagent';
import faker from 'faker'; /*eslint-disable-line*/
import { startServer, stopServer } from '../lib/server';
import { createMatchMock, removeAllResources } from './lib/match-mock';
import { createAccountMock } from './lib/accountMock';

const apiUrl = `http://localhost:${process.env.PORT}/api`;

describe('TWILIO ITEM TEST', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeAllResources);

  let testAccount; //eslint-disable-line
  beforeEach(async () => {
    try {
      testAccount = await createMatchMock();
    } catch (err) {
      console.log(err);  /* eslint-disable-line */
    }
    return undefined;
  });

  describe('Twilio POST requests', () => {
    let testAccount2;
    beforeEach(async () => {
      try {
        testAccount2 = await createAccountMock();
      } catch (err) {
        console.log(err);
      }
    });

    test('POST 200 to /api/items', async () => {
      const mockItem = {
        postType: 'Found',
        itemType: 'water bottle',
      };
      try {
        const returnItem = await superagent.post(`${apiUrl}/items`)
          // .auth(testAccount2.account.username, testAccount2.originalRequest.password)
          .set('Authorization', `Bearer ${testAccount2.token}`)
          .field(mockItem)
          .attach('image', `${__dirname}/assets/orange-water-bottle.jpg`);
        expect(returnItem.status).toEqual(200);
        expect(returnItem.body.postType).toEqual('Found');
        expect(returnItem.body.itemType).toEqual('water bottle');
        expect(returnItem.body._id).toBeTruthy();
        expect(returnItem.body.imageUrl).toBeTruthy();
      } catch (err) {
        expect(err).toEqual('something bad');
      }
    });
  });
});
