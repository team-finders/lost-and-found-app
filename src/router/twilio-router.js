'use strict';

import { Router } from 'express';
import Account from '../model/account';
import Items from '../model/items';
import Admin from '../model/admin';


function getAdminNum() {
  return Admin.find({})
    .then((admin) => {
      return admin[0].phoneNumber;
    })
    .catch(console.error);
}

const MessagingResponse = require('twilio').twiml.MessagingResponse; //eslint-disable-line

const twilioRouter = new Router();

twilioRouter.post('/api/sms', (req, res) => {
  const twiml = new MessagingResponse();
  const body = req.body.Body.toLowerCase();
  const from = req.body.From.slice(1);
  return Account.findOne({ phoneNumber: from })
    .then((account) => {
      return Items.findOne({ accountId: account._id });
    })
    .then((item) => {
      if (item.itemType === 'wallet/purse' || item.itemType === 'keys' || item.itemType === 'computer') {
        return getAdminNum()
          .then((num) => {
            if (body === 'yes') {
              twiml.message(`Great! The Admin has it, please contact him/her at ${num} for your ${item.itemType}`);
            } else if (body === 'no') {
              twiml.message('We\'ll keep on looking!');
            } else {
              twiml.message('Please respond with "yes" or "no"');
            }
    
            res.writeHead(200, { 'Content-Type': 'text/xml' });
            res.end(twiml.toString());
          })
          .catch(console.error);
      } 

      if (body === 'yes') {
        twiml.message('Great! Please look for it at the campus Lost and Found');
      } else if (body === 'no') {
        twiml.message('We\'ll keep on looking!');
      } else {
        twiml.message('Please respond with "yes" or "no"');
      }

      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(twiml.toString());

      return undefined;
    });
});

export default twilioRouter;

