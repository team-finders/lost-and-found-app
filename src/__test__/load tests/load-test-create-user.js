'use strict';

const faker = require('faker');
const uuid = require('uuid/v4');

const loadTestUser = module.exports = {};

loadTestUser.create = (accountContext, events, done) => {
  // properties from account schema
  accountContext.vars.username = faker.internet.userName() + uuid();
  accountContext.vars.email = faker.internet.email() + uuid();
  accountContext.vars.password = faker.internet.password() + uuid();

  // properties from item schema
  accountContext.vars.bio = faker.lorem.words(10) + uuid();
  accountContext.vars.postType = faker.name.postType() + uuid();
  accountContext.vars.itemType = faker.name.itemType() + uuid();
  accountContext.vars.color = faker.name.color() + uuid();
  return done();
};

