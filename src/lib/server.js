'use strict';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import logger from './logger';

import errorMiddleware from './middleware/error-middleware';
import loggerMiddleware from './middleware/logger-middleware';

import authRouter from '../router/auth-router';
import adminRouter from '../router/admin-router';
import itemRouter from '../router/items-router';
import twilioRouter from '../router/twilio-router';

const app = express();
const PORT = process.env.PORT || 3000;

let server = null;

app.use(cors({ credentials: true, origin: 'http://localhost:8080' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(loggerMiddleware);
app.use(authRouter);
app.use(adminRouter);
app.use(itemRouter);
app.use(twilioRouter);
app.use(errorMiddleware);

// app.all('*', (request, response) => {
//   console.log('Returning a 404 from the catch-all route', response.err);
//   return response.sendStatus(404).send('Route Not Registered');
// });

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(PORT, () => {
        console.log('Server listening on Port: ', PORT);  /* eslint-disable-line */
      });
    })
    .catch((err) => {
      throw err;
    });
};

const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is off');
      });
    })
    .catch((err) => {
      throw err;
    });
};

export { startServer, stopServer };
