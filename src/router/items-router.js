
import multer from 'multer'; //eslint-disable-line
import { Router } from 'express';
import HttpErrors from 'http-errors';
import Item from '../model/items';
import bearerAuthMiddleware from '../lib/middleware/bearer-auth-middleware';
import { s3Upload, s3Remove } from '../lib/s3'; /* eslint-disable-line */
import logger from '../lib/logger';
import permit from '../lib/middleware/permissions-middleware';

const multerUpload = multer({ dest: `${__dirname}/../temp` });

const itemsRouter = new Router();

itemsRouter.post('/api/items', bearerAuthMiddleware, permit('account', 'admin'), multerUpload.any(), (request, response, next) => {
  if (!request.account) return next(new HttpErrors(400, 'POST REQUEST to ITEM ROUTER: Invalid Request'));
  if (!request.files) {
    Item.init()
      .then(() => {
        return new Item({
          ...request.body,
          locationId: request.account.locationId,
          accountId: request.account._id,
        }).save();
      })
      .then((item) => {
        logger.log(logger.INFO, 'POST item created');
        return response.json(item);
      })
      .catch(next);
    return undefined;
  } 

  if (request.files.length !== 1) {
    return next(new HttpErrors(400, 'IMAGE ROUTER POST REQUEST: invalid request'));
  } 
  const [file] = request.files;
  logger.log(logger.INFO, `ITEMS ROUTER POST TO AWS: valid file ready to upload: ${JSON.stringify(file, null, 2)}`);
  const key = `${file.filename}.${file.originalname}`;

  return s3Upload(file.path, key)
    .then((url) => {
      logger.log(logger.INFO, `IMAGE ROUTER POST: received a valid url from Amazon S3: ${url}`);
      return new Item({
        ...request.body,
        locationId: request.account.locationId,
        accountId: request.account._id,
        imageUrl: url,
        imageFileName: key,
      }).save();
    })
    .then((item) => {
      logger.log(logger.INFO, `POST REQUEST to ITEM ROUTER: 200 for new Item created, ${JSON.stringify(item)}`);
      return response.json(item);
    })
    .catch(next);
});

itemsRouter.get('/api/items/:id?', bearerAuthMiddleware, permit('account', 'admin'), (request, response, next) => {
  if (!request.account) return next(new HttpErrors(400, 'GET REQUEST to ITEM ROUTER: 400 for invalid request'));

  if (!request.params.id) {
    return Item.find({})
      .then((items) => {
        return response.json(items);
      })
      .catch(next);
  }

  Item.findOne({ _id: request.params.id })
    .then((item) => {
      if (!item) return next(new HttpErrors(400, 'GET REQUEST to ITEM ROUTER: item not found'));
      return response.json(item);
    })
    .catch(next);
  return undefined;
});
// JV: Be mindful of corpose code

// return Item.findById(request.params.id)
// .then((image) => {
// if (!image) return next(new HttpErrors(404, 'IMAGE ROUTE DELETE: no image found'));
// const key = image.fileName;
// return s3Remove(key);
// })
// .then((result) => {
// return response.json(result);
// logger.log(logger.INFO, 'IMAGE ROUTER DELETE: successfully deleted image');

itemsRouter.delete('/api/items/:id?', bearerAuthMiddleware, permit('account', 'admin'), (request, response, next) => {
  if (!request.account) return next(new HttpErrors(400, 'GET REQUEST to ITEM ROUTER: 400 for invalid request'));

  if (!request.params.id) {
    return Item.find({})
      .then((items) => {
        return response.json(items);
      })
      .catch(next);
  }

  Item.findOneAndDelete({ _id: request.params.id })
    .then(() => {
      logger.log(logger.INFO, `${request.params.id} deleted`);
      return response.status(200).send('item deleted');
    })
    .catch(next);
  return undefined;
});

itemsRouter.put('/api/items/:id?', bearerAuthMiddleware, permit('account', 'admin'), (request, response, next) => {
  if (!request.account) return next(new HttpErrors(400, 'GET REQUEST to ITEM ROUTER: 400 for invalid request'));

  if (!request.params.id) {
    return Item.find({})
      .then((items) => {
        return response.json(items);
      })
      .catch(next);
  }

  if (Object.keys(request.body).length === 0) {
    return next(new HttpErrors(400, 'Missing body'));
  }

  const options = {
    new: true,
    runValidators: true,
  };

  return Item.init()
    .then(() => {
      return Item.findByIdAndUpdate(request.params.id, request.body, options);
    })
    .then((newItem) => {
      logger.log(logger.INFO, `item updated: ${JSON.stringify(newItem)}`);
      return response.json(newItem);
    })
    .catch(next);
});

export default itemsRouter;
