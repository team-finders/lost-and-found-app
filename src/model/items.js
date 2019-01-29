'use strict';

import mongoose from 'mongoose';
import itemPreHook from '../lib/twilio';

const itemsSchema = mongoose.Schema({
  postType: {
    type: String,
    enum: ['Lost', 'Found'],
    required: true,
  },
  itemType: {
    type: String,
    // JV: I think it was good to keep your scope smasll with hardcoded items in your enum property so that you could have an easier time with your project
    enum: ['water bottle', 'lunch box', 'clothing', 'jewelry', 'wallet/purse', 'keys', 'computer', 'cell phone', 'glasses/sunglasses', 'other'],
    required: true,
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
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

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('items', itemsSchema, 'items', skipInit);

itemsSchema.pre('save', itemPreHook);
