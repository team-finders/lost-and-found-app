import Item from '../model/items';
import Account from '../model/account';

require('dotenv').config();

// const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

function sendMessage(phoneNum) {
  return client.messages //eslint-disable-line
    .create({
      body: 'Is this your lost item??',
      from: '+12062037088',
      to: `+${phoneNum}`,
    })
    .then((message) => {
      return message.sid;
    })
    .done();
}

function itemPreHook(done) {
  return Item.find({}) 
    .then((item) => {
      if (!item.length) {
        return undefined;
      }
      for (let i = 0; i < item.length; i++) {
        if (item[i].postType !== this.postType && item[i].itemType === this.itemType) {
          return Account.findOne({ _id: item[i].accountId })
            .then((account) => {
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

