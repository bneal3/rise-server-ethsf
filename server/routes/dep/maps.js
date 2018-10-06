var globals = require('./../../globals');
var enumerations = require('./../enumerations');
var _ = require('lodash');
var express = require('express'),
    router = express.Router();

router.post('/', globals.authenticate.admin, (req, res) => {
  var body = _.pick(req.body, ['system', 'currency', 'tier', 'owner', 'name', 'production', 'principal']);

  body.balance = body.principal;
  body.watchlists = [];

  console.log(body);

  var account = new globals.Account(body);

  account.save().then(() => {
    return res.status(200).send({
      response: new globals.Response('SUCCESS',
        'Account created successfully.',
        account
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

router.get('/id/:id', globals.authenticate.admin, (req, res) => {
  var id = req.params.id;

  globals.Account.findById(id).then((account) => {
    return res.status(200).send({
      response: new globals.Response('SUCCESS',
        'Account retrieved successfully.',
        account
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

router.get('/', globals.authenticate.admin, (req, res) => {
  globals.Account.find({}).then((accounts) => {
    return res.status(200).send({
      response: new globals.Response('SUCCESS',
        'Accounts retrieved successfully.',
        accounts
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

router.patch('/id/:id', globals.authenticate.admin, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['production', 'maxTrades']);

  if(!body.production){
    body.production = false;
  }

  globals.Account.findOneAndUpdate({
    id: id
  }, {
    production: body.production,
    maxTrades: body.maxTrades
  }, {
    new: true
  }).then((account) => {
    return res.status(404).send({
      response: new globals.Response('SUCCESS',
        'Account updated successfully.',
        account
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

router.delete('/id/:id', globals.authenticate.admin, (req, res) => {
  var id = req.params.id;

  // FLOW: Reject request if not a valid Id
  if(!globals.ObjectId.isValid(id)){
    return res.status(404).send({
      response: new globals.Response('ERROR',
        'Account id not valid.'
      )
    });
  }

  // FLOW: Delete account
  globals.Account.findByIdAndRemove(id).then((account) => {
    // FLOW: Return if account not found
    if(!account){
      return res.status(404).send({
        response: new globals.Response('ERROR',
          'Account not found.'
        )
      });
    }

    // FLOW: Send response
    res.status(200).send({
      response: new globals.Response('SUCCESS',
        'Account deleted successfully.',
        account
      )
    });
  });
});

module.exports = router;
