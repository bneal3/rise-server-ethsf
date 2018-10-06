require('./../config/config.js');

var globals = require('./../globals');

// FUNCTION: Determines whether or not route has an admin access token and verifies it
var admin = (req, res, next) => {
  // FLOW: Check for admin token
  var key = req.header('x-admin');

  if(key === process.env.ADMIN_SECRET) {
    next();
  } else {
    return res.status(401).send({
      response: new globals.Response('ERROR',
        'Not authorized.'
      )
    });
  }
}

// FUNCTION: Makes sure environment is non-production and determines whether or not route has an admin access token and verifies it
var staging = (req, res, next) => {
  // FLOW: Make sure not in development or production
  if(process.env.NODE_ENV){
    return res.status(401).send({
      response: new globals.Response('ERROR',
        'Only allowed to use this route in non-production environments.'
      )
    });
  } else {
    next();
  }
}

module.exports = {admin, staging};
