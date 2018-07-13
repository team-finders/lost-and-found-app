import faker from 'faker';
import Account from '../../model/account';
import Admin from '../../model/admin';

const createAccountMock = () => {
  const mockData = {};
  const originalRequest = {
    username: faker.internet.userName(),
    password: faker.lorem.words(5),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneNumber: faker.random.number(),
  };

  return Admin.find({})
    .then((admin) => {
      return admin[0]._id;
    })
    .then((locationId) => {
      return Account.create(originalRequest.username, originalRequest.password, originalRequest.email, originalRequest.firstName, originalRequest.lastName, locationId, originalRequest.phoneNumber);
    })
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
