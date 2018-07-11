'use strict';

import mongoose from 'mongoose';
// import autoIncrement from 'mongoose-auto-increment';

// const createConnection = mongoose.connect('mongodb://localhost/api/items');
//  
// autoIncrement.initialize(createConnection);

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
  imageUrl: {
    type: String,
  },
  imageFileName: {
    type: String,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

}, { timestamps: true });

// itemsSchema.plugin(autoIncrement.plugin, 'Item');
// 
// itemsSchema.plugin(autoIncrement.plugin, {
  // startAt: 1001,
  // incrementBy: 12,
// });

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('items', itemsSchema, 'items', skipInit);

