var globals = require('./../globals');
var enumerations = require('./../enumerations');
var _ = require('lodash');
var express = require('express'),
    router = express.Router();

// POST /players
// USAGE: Used to create a new player in the database
router.post('/', (req, res) => {
  var body = _.pick(req.body, ['username', 'password']);

  console.log(body);

  // FLOW: Create player
  var player = new globals.player(body);

  // FLOW: Save player
  player.save().then(() => {
    return player.generateToken('auth');
  }).then((token) => {
    // FLOW: Send response
    res.header('x-auth', token).send({
      response: new globals.Response('SUCCESS',
        'Player registered successfully.',
        player
      )
    });
  }).catch((e) => {
    res.status(400).send({
      response: new globals.Response('ERROR',
        e.errmsg
      )
    });
  });
});

// GET /players/id/:id
// USAGE: Gets a player object based on the Id
router.get('/id/:id', globals.authenticate.user, (req, res) => {
  var id = req.params.id;

  // FLOW: Return if not valid Id
  if(!globals.ObjectId.isValid(id)){
    return res.status(404).send({
      response: new globals.Response('ERROR',
        'Not a valid player id.'
      )
    });
  }

  // FLOW: Find by Id
  globals.Player.findById(id).then((player) => {
    // FLOW: Return if no player Id
    if(!player){
      return res.status(404).send({
        response: new globals.Response('ERROR',
          'player not found.'
        )
      });
    }

    // FLOW: Return partial player object
    res.status(200).send({
      response: new globals.Response('SUCCESS',
        'Player fetched successfully.',
        player
      )
    });
  }).catch((e) => {
    res.status(400).send({
      response: new globals.Response('ERROR',
        'Problem finding specified player.'
      )
    });
  });
});

// DELETE /players/id/:id
// USAGE: Gets a player object based on the Id
router.delete('/id/:id', globals.authenticate.user, (req, res) => {
  var id = req.params.id;

  // FLOW: Return if not valid Id
  if(!globals.ObjectId.isValid(id)){
    return res.status(404).send({
      response: new globals.Response('ERROR',
        'Not a valid player id.'
      )
    });
  }

  // FLOW: Find by Id
  globals.Player.findById(id).then((player) => {
    // FLOW: Return if no player Id
    if(!player){
      return res.status(404).send({
        response: new globals.Response('ERROR',
          'Player not found.'
        )
      });
    }

    // FLOW: Return partial player object
    res.status(200).send({
      response: new globals.Response('SUCCESS',
        'player fetched successfully.',
        player
      )
    });
  }).catch((e) => {
    res.status(400).send({
      response: new globals.Response('ERROR',
        'Problem finding specified player.'
      )
    });
  });
});

// GET /players/me
// USAGE: Used to return player based on auth token
router.get('/me', globals.authenticate.user, (req, res) => {
  var response = _.pick(req.player, ['_id', 'username', 'avatar']);

  return res.status(200).send({
    response: new globals.Response('SUCCESS',
      'player authenticated successfully.',
      response
    )
  });
});

// POST /players/login
// USAGE: Used to create new authentication token for player. Logs out player everywhere else.
router.post('/login', (req, res) => {
  // VERSION: 1 - Used to take in a username as a parameter, now changed to identifier.
  var body = _.pick(req.body, ['username', 'password']);
  console.log(body);

  // FLOW: Find player by credentials
  globals.player.findByCredentials(body.username, body.password).then((player) => {
    // FLOW: Deactivate any other active auth token
    player.deactivateTokens('auth').then(() => {

      // FLOW: Generate new token
      player.generateToken('auth').then((token) => {
        // FLOW: Return the player and auth token
        return res.header('x-auth', token).send({
          response: new globals.Response('SUCCESS',
            'Login successful.',
            player
          )
        });
      }).catch((e) => {
        res.status(400).send({
          response: new globals.Response('ERROR',
            'There was a problem authenticating player\'s account.'
          )
        });
      });
    }).catch((e) => {
      res.status(400).send({
        response: new globals.Response('ERROR',
          'Problem with internal method: Player.deactivateTokens',
          e
        )
      });
    });
  }).catch(() => {
    res.status(400).send({
      response: new globals.Response('ERROR',
        'Incorrect credentials.'
      )
    });
  });
});

// DELETE /players/me/token
// USAGE: Effectively logs out
router.delete('/me/token', globals.authenticate.user, (req, res) => {
  console.log(req.body);
  req.Player.deactivateTokens('auth').then(() => {
    res.status(200).send({
      response: new globals.Response('SUCCESS',
        'Logout successful.'
      )
    });
  }).catch((e) => {
    res.status(400).send({
      response: new globals.Response('ERROR',
        'Problem with internal method: player.deactivateTokens',
        e
      )
    });
  });
});

// PATCH /players/me/profile
// USAGE: Used to update player fields
router.patch('/me/profile', globals.authenticate.user, (req, res) => {
  var body = _.pick(req.body, ['item', 'value']);
  console.log(body);

  if(!body.item || !body.value){
    return res.status(400).send({
      response: new globals.Response('ERROR',
        'No data to patch.'
      )
    });
  }

  // FLOW: Validate each field before inputting into database
  switch(body.item){
    case 'identifier':
      var validated = false;
      if(body.value.method === 'phone'){
        validated = validation.validatePhone(body.value.value);
      } else if(body.value.method === 'username'){
        validated = validation.validateusername(body.value.value);
      }

      if(!validated){
        return res.status(400).send({
          response: new globals.Response('ERROR',
            'One or more identifiers is not valid.'
          )
        });
      }

      var stored = _.find(req.player.identifiers, function (o) { return o.method === body.value.method; });
      stored.value = body.value.value;
      break;
    case 'name':
      req.player.name = body.value;
      break;
    case 'avatar':
      // TODO: Validate field by making sure it has a counterpart in firebase storage
      req.player.avatar = body.value;
      break;
  }

  // FLOW: Save player object
  req.player.save().then(() => {
    res.status(200).send({
      response: new globals.Response('SUCCESS',
        'Item changed successfully.',
        req.player.toJSON()
      )
    });
  }).catch((e) => {
    res.status(400).send({
      response: new globals.Response('ERROR',
        'Problem changing item.',
        e
      )
    });
  });
});

// PATCH /players/me/password
// USAGE: Used to update player password field
router.patch('/me/password', globals.authenticate.user, (req, res) => {
  var body = _.pick(req.body, ['old', 'new']);
  console.log(body);

  // FLOW: Decrypt the old password to check if similar
  bcrypt.compare(body.old, req.player.password, (error, result) => {
    if (result) {
      // FLOW: Correct if similar
      req.player.password = body.new;
      req.player.save().then(() => {
        // FLOW: Return updated player
        res.status(200).send({
          response: new globals.Response('SUCCESS',
            'Password changed successfully.',
            req.player.toJSON()
          )
        });
      }).catch((e) => {
        res.status(400).send({
          response: new globals.Response('ERROR',
            'Problem saving new password.',
            e
          )
        });
      });
    } else {
      res.status(400).send({
        response: new globals.Response('ERROR',
          'Password incorrect.'
        )
      });
    }
  });
});

module.exports = router;
