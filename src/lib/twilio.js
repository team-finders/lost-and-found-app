import Item from '../model/items';
import Account from '../model/account';

require('dotenv').config();

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

function sendMessage(phoneNum) {
  console.log('TWILIO', phoneNum);
  console.log('CLIENT', client);
  console.log('CLIENT.MESSAGES', client.messages);
  
  return client.messages
    .create({
      body: 'Is this your lost item??',
      from: '+12062037088',
      to: `+${phoneNum}`,
    })
    .then((message) => {
      console.log(message.sid);
      return message.sid;
    })
    .catch((err) => {
      console.log('ERROR', err);
    })
    .done();
}

function itemPreHook(done) {
  return Item.find({}) 
    .then((item) => {
      if (!item.length) {
        return undefined;
      }
      console.log('THIS', this);
      console.log('EXISTING', item);
      for (let i = 0; i < item.length; i++) {
        if (item[i].postType !== this.postType && item[i].itemType === this.itemType) {
          return Account.findOne({ _id: item[i].accountId })
            .then((account) => {
              console.log(account);
              return sendMessage(account.phoneNumber);
            })
            .catch(console.error);
        }
      }
      return undefined;
    })
    .then(() => done())
    .catch(done);
}

export default itemPreHook;

