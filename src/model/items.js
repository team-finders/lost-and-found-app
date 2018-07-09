'use strict';

import mongoose from 'mongoose';


const itemsSchema = mongoose.Schema({
  postType: {
    type: String,
    enum: ['Lost', 'Found'],
    required: true,
  },
  itemType: {
    type: String,
    enum: ['water bottle', 'lunch box', 'clothing', 'jewelry', 'wallet/purse', 'keys', 'computer', 'cell phone', 'glasses/sunglasses', 'other'],
    required: true,
  },
  color: {
    type: String,
  },
  material: {
    type: String,
  },
  /* I think a "status" may have to live elsewhere; this is more of an administrative property and not something that a user will need to deal with.
  //   status: {
  // type: String,
  // enum: ['With Admin', 'Claimed, awaiting pick-up', 'Claimed'],
  // required: true,
   }, */

  // Is the Item Id set up in the DB?
  //   itemId: {
  // type: mongoose.Schema.Types.ObjectId,
  // required: true,
  //   },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

}, { timestamps: true });

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('items', itemsSchema, 'items', skipInit);

/* Authentication should be used to access the database of items. A foundItem should return a method to indicate true/false if the item belongs to someone.
Only the administrator has permission to delete an item.
*/

