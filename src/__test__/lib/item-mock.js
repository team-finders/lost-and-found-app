import faker from 'faker'; /*eslint-disable-line*/
import { createAccountMock, removeAccountMock } from './accountMock';
import Item from '../../model/items';

const createItemMock = () => {
  const mockData = {};

  return createAccountMock()
    .then((mockAccount) => {
      mockData.originalRequest = mockAccount.originalRequest;
      mockData.account = mockAccount.account;
      mockData.token = mockAccount.token;
      
      const mockItem = {
        postType: 'Lost',
        itemType: 'water bottle',
        locationId: mockData.account.locationId,
        accountId: mockData.account._id,
      };
      return new Item(mockItem).save();
    })
    .then((item) => {
      mockData.item = item;
      return mockData;
    })
    .catch((err) => {
      throw err;
    });
};

const removeAllResources = () => {
  return Promise.all([
    Item.remove({}),
    removeAccountMock(),
  ]);
};

export { createItemMock, removeAllResources };
