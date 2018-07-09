'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jsonWebToken from 'jsonwebtoken';
import HttpErrors from 'http-errors';

const HASH_ROUNDS = 1;
const TOKEN_SEED_LENGTH = 50;

const accountSchema = mongoose.Schema({
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
  },
}, { timestamps: true });

accountSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash)
    .then((result) => {
      if (!result) {
        throw new HttpErrors(401, 'ACCOUNT MODEL: Incorrect data');
      }
      return this;
    })
    .catch((err) => {
      throw new HttpErrors(500, `ERROR CREATING TOKEN: ${JSON.stringify(err)}`);
    });
};

accountSchema.methods.createToken = function createToken() {
  console.log(this.tokenSeed);
  this.tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save()
    .then((updatedAccount) => {
      console.log(updatedAccount);
      return jsonWebToken.sign({ tokenSeed: updatedAccount.tokenSeed }, process.env.SECRET_KEY);
    })
    .catch((err) => {
      throw err;
    });
};

const skipInit = process.env.NODE_ENV === 'development';

const Account = mongoose.model('accounts', accountSchema, 'accounts', skipInit);

// Create a new account
Account.create = (username, password, email, firstName, lastName, phoneNumber) => {
  console.log(password);
  return bcrypt.hash(password, HASH_ROUNDS)
    .then((passwordHash) => {
      password = null; /*eslint-disable-line*/
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
      return new Account({
        username,
        passwordHash,
        email,
        firstName,
        lastName,
        phoneNumber,
        tokenSeed,
      }).save();
    })
    .catch((err) => {
      throw err;
    });
};

export default Account;
  
