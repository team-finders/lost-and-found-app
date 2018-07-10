import faker from 'faker';
import Admin from '../../model/admin';

const createAdminMock = () => {
  const mockData = {};
  const originalRequest = {
    username: faker.internet.userName(),
    password: faker.lorem.words(5),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneNumber: faker.random.number(),
  };

  return Admin.create(originalRequest.username, originalRequest.password, originalRequest.email, originalRequest.firstName, originalRequest.lastName)
    .then((account) => {
      mockData.originalRequest = originalRequest;
      mockData.account = account;
      return account.createToken();
    })
    .then((token) => {
      mockData.token = token;
      return Admin.findById(mockData.account._id);
    })
    .then((account) => {
      mockData.account = account;
      return mockData;
    });
};

const removeAdminMock = () => Admin.remove({});

export { createAdminMock, removeAdminMock };
