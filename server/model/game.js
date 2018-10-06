var globals = require('./../globals');
var enumerations = require('./../enumerations');
var _ = require('lodash');

var GameSchema = new globals.mongoose.Schema({
  players: [{
		playerId: {
			type: String,
			required: true
		},
    category: {
      type: String,
      required: true
    },
		color: {
			type: String,
			required: true
		}
	}],
	territories: [{
		placement: {
			type: Number,
			required: true
		},
		ownership: {
			playerId: {
				type: String,
				required: true
			}
		},
		units: [{
			owner: {
				type: String,
				required: true
			},
			category: {
				type: String,
				required: true
			}
		}],
		battles: [{
			winner: {
				type: String,
				required: true
			}
		}]
	}],
  status: {
    type: String,
    default: "ACTIVE"
  },
	startTime: {
		type: Number,
		default: globals.moment().format('x')
	}
});

// USAGE: Get Id
GameSchema.methods.getId = function () {
  var game = this;

  return game._id.toString();
};

var Game = globals.mongoose.model('Game', GameSchema);

module.exports = {Game};
