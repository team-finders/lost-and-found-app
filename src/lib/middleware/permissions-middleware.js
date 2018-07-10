'use strict';

export default function permit(...allowed) {
  const isAllowed = role => allowed.indexOf(role) > -1;

  return (req, res, next) => {
    console.log(req.permissions);
    if (req.body.postType === 'Found') {
      return next();
    }

    if (req.permissions && isAllowed(req.permissions)) {
      return next();
    }
    
    return res.status(401).send('not permitted');
  };
}
