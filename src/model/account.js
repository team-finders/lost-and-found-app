'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jsonWebToken from 'jsonwebtoken';
import HttpErrors from 'http-errors';

const HASH_ROUNDS = 1;
const TOKEN_SEED_LENGTH = 50;

const accountSchema = mongoose.Schema({
  passwordHash: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },

}, { timestamps: true });

accountSchema.methods.verifyPasswordPromise = function verifyPasswordPromise(password) {
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
