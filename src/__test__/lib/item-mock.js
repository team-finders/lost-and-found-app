import faker from 'faker';
import createAccountMockPromise from './accountMock';

const createItemMockPromise = () => {
  const mockData = {};

  return createItemMockPromise()
    .then((mockItemData) => {
      mockData.account = mockItemData.account;
      mockData.token = mockItemData.token;
      
      const mockItem = {
        postType: faker.lorem.word(),
        itemType: faker.lorem.words(2),
        accountId: mockItemData.account._id,
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
    removeAccountMockPromise(),
  ]);
};

export { createItemMockPromise, removeAllResources };
