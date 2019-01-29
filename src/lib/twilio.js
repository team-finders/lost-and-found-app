import Item from '../model/items';
import Account from '../model/account';
// JV: abstracting this out was an awesome idea!

require('dotenv').config();

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

function sendMessage(phoneNum, imageUrl) {
  return client.messages //eslint-disable-line
    .create({
      body: 'Is this your lost item??',
      from: process.env.TWILIO_NUM,
      mediaUrl: `${imageUrl}`,
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
              return sendMessage(account.phoneNumber, this.imageUrl);
            })
            .catch(console.error); //eslint-disable-line
        }
      }
      return undefined;
    })
    .then(() => done())
    .catch(done);
}

export default itemPreHook;

