import faker from 'faker';
import Item from '../../model/items';
import Account from '../../model/account';

const createAccountMock = () => {
  const mockData = {};
  const originalRequest = {
    username: faker.internet.userName(),
    password: faker.lorem.words(5),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneNumber: '2065187920',
  };

  return Account.create(originalRequest.username, originalRequest.password, originalRequest.email, originalRequest.firstName, originalRequest.lastName, originalRequest.phoneNumber)
    .then((account) => {
      mockData.originalRequest = originalRequest;
      mockData.account = account;
      return account.createToken();
    })
    .then((token) => {
      mockData.token = token;
      return Account.findById(mockData.account._id);
    })
    .then((account) => {
      mockData.account = account;
      return mockData;
    });
};

const removeAccountMock = () => Account.remove({});

const createMatchMock = () => {
  const mockData = {};

  return createAccountMock()
    .then((mockAccount) => {
      mockData.originalRequest = mockAccount.originalRequest;
      mockData.account = mockAccount.account;
      mockData.token = mockAccount.token;
      
      const mockItem = {
        postType: 'Lost',
        itemType: 'water bottle',
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

export { createMatchMock, removeAllResources };
