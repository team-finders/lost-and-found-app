'use strict';

const fake = require('./../lib/fake');

describe('Jest working', () => {
  test('#fake', () => {
    expect(fake()).toBe('working');
  });
});
