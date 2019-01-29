'use strict';

// JV: Great job with this middle ware and using a spread operater and partial application on this. Awesome!
export default function permit(...allowed) {
  const isAllowed = role => allowed.indexOf(role) > -1;

  return (req, res, next) => {
    if (req.body.postType === 'Found' && req.method.toString() === 'POST') {
      return next();
    }

    if (req.permissions && isAllowed(req.permissions)) {
      return next();
    }
    
    return res.status(401).send('not permitted');
  };
}
