import faker from 'faker';
import Account from '../../model/account';

const createAccountMock = () => {
  const mockData = {};
  const originalRequest = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.lorem.words(5),
  };

  return Account.create(originalRequest.username, originalRequest.email, originalRequest.password)
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

export { createAccountMock, removeAccountMock };
