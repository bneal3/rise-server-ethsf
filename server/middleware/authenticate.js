require('./../config/config.js');

var globals = require('./../globals');

// FUNCTION: Determines whether or not route has an x-auth access token and verifies it
var user = (req, res, next) => {
  var token;
  var access;

  if(req.header('x-auth')) {
    token = req.header('x-auth');
    access = 'auth';
  } else {
    return res.status(401).send({
      response: new globals.Response('ERROR',
        'Not authorized.'
      )
    });
  }

  // FLOW: Find user by token
  globals.Player.findByToken(access, token).then((player) => {
    if (!player) {
      console.log('Token not found.');
      return Promise.reject();
    }

    // FLOW: Sets the user and token
    req.player = player;
    req.token = token;

    console.log('\n' + req.player.username + '\n');

    next();
  }).catch((e) => {
    res.status(401).send({
      response: new globals.Response('ERROR',
        'Not authorized.'
      )
    });
  });
}

module.exports = {user};
