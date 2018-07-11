'use strict';

import { Router } from 'express';

const MessagingResponse = require('twilio').twiml.MessagingResponse; //eslint-disable-line

const twilioRouter = new Router();

twilioRouter.post('/api/sms', (req, res, next) => {
  const twiml = new MessagingResponse();
  const body = req.body.body.toLowerCase();

  if (body === 'yes') {
    twiml.message('Great! Please look for it at the campus Lost and Found');
  } else if (body === 'no') {
    twiml.message('We\'ll keep on looking!');
  } else {
    twiml.message('Please respond with "yes" or "no"');
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

export default twilioRouter;
