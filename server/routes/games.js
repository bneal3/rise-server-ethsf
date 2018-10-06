var globals = require('./../globals');
var enumerations = require('./../enumerations');
var _ = require('lodash');
var express = require('express'),
    router = express.Router();

router.post('/', globals.authenticate.user, (req, res) => {
  var body = _.pick(req.body, ['players']);

  console.log(body);

  var game = new globals.Game(body);

  game.save().then(() => {
    return res.status(200).send({
      response: new globals.Response('SUCCESS',
        'Game created successfully.',
        game
      )
    });
  }).catch((e) => {
    return res.status(400).send({
      response: new globals.Response('ERROR',
        'Bad request.'
      )
    });
  });
});

router.get('/id/:id', (req, res) => {
  var id = req.params.id;

  globals.Game.findById(id).then((game) => {
    return res.status(200).send({
      response: new globals.Response('SUCCESS',
        'Game retrieved successfully.',
        game
      )
    });
  }).catch((e) => {
    return res.status(400).send({
      response: new globals.Response('ERROR',
        'Bad request.'
      )
    });
  });
});

router.get('/', (req, res) => {
  globals.Game.find({}).then((games) => {
    return res.status(200).send({
      response: new globals.Response('SUCCESS',
        'Games retrieved successfully.',
        games
      )
    });
  }).catch((e) => {
    return res.status(400).send({
      response: new globals.Response('ERROR',
        'Bad request.'
      )
    });
  });
});

router.patch('/state/:id', globals.authenticate.user, (req, res) => {
  var id = req.params.id;
  // FLOW: Extract changes
  var body = _.pick(req.body, ['territories']);

  // TODO: Call solidity functions to update state of game

  globals.Game.findOneAndUpdate({
    id: id
  }, {
    territories: body.territories
  }, {
    new: true
  }).then((game) => {
    return res.status(404).send({
      response: new globals.Response('SUCCESS',
        'Game updated successfully.',
        game
      )
    });
  }).catch((e) => {
    return res.status(400).send({
      response: new globals.Response('ERROR',
        'Bad request.'
      )
    });
  });
});

module.exports = router;
