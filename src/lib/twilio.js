import Item from '../model/items';
import Account from '../model/account';

const client = require('twilio')(process.env.accountSid, process.env.authToken);

const sendMessage = (imageUrl, phoneNum) => {
  console.log('SEND', phoneNum, imageUrl);
  client.messages
    .create({
      body: 'Is this your lost item?',
      media: imageUrl,
      from: '+12062037088',
      to: `+${phoneNum}`,
    })
    .then(message => console.log(message.sid))
    .done();
};

function itemPreHook(done) {
  return Item.find({}) 
    .then((item) => {
      if (!item) {
        throw new Error(404, 'No matching items');
      }
      console.log('THIS', this);
      console.log('EXISTING', item);
      for (let i = 0; i < item.length; i++) {
        if (item[i].postType !== this.postType && item[i].itemType === this.itemType) {
          return Account.findById(item[i].accountId)
            .then((account) => {
              console.log('MATCH?', account);
              return sendMessage(this.image.url, account.phoneNumber);
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
