process.env.NODE_ENV = 'development';
process.env.PORT = 5000;
process.env.MONGODB_URI = 'mongodb://localhost/testing-foundit';
process.env.SECRET_KEY = 'randomstdringasdfasf309484950495';

const isAwsMock = true;

if (isAwsMock) {
  process.env.AWS_BUCKET = 'fake';
  process.env.AWS_SECRET_ACCESS_KEY = 'fake';
  process.env.AWS_ACCESS_KEY_ID = 'fake';
  require('./setup');
} else {
  require('dotenv').config();
}

process.env.accountSid = 'AC421bc4347e3cd65960a0eb902f1c330b';
process.env.authToken = 'b0789aceb3463f875284fe9d33073cf6';
