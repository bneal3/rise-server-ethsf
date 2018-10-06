// PURPOSE: Used to store global variables across entire project

// ******************
// Comment Legend
// ******************
// TODO: Things todo
// FLOW: Flow of application
// NOTE: General note
// FUNCTION: Description of the function of a block of code
// USAGE: How to use a particular function
// DEV: Notes that indicate a development fix that will be changed in the final product

require('./config/config');

// Module exports
exports.moment = require('moment');

// Database exports
var {ObjectId} = require('mongodb');
exports.ObjectId = ObjectId;
var {mongoose} = require('./db/mongoose');
exports.mongoose =  mongoose;

// Models
var {Player} = require('./model/player.js');
exports.Player = Player;
var {Game} = require('./model/game.js');
exports.Game = Game;

// Modules
var {Response} = require('./modules/response.js');
exports.Response = Response;

// Middleware
exports.authenticate = require('./middleware/authenticate');
