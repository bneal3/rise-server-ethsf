var globals = require('./../globals');
var enumerations = require('./../enumerations');
var _ = require('lodash');

var GameSchema = new globals.mongoose.Schema({
	system: {
		type: String,
		required: true
	},
	currency: {
		type: String,
		required: true
	},
	tier: {
		type: String,
		required: true
	},
	owner: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	active: {
		type: Boolean,
		default: true
	},
	production: {
		type: Boolean,
		default: false
	},
	principal: {
		type: Number,
		required: true
	},
	balance: {
		type: Number,
		required: true
	},
	activeTrades: {
		type: Number,
		default: 0
	},
	maxTrades: {
		type: Number,
		default: 3
	},
	watchlists: {
		type: [String]
	},
	transactions: [{
		method: {
			type: String
		},
		amount: {
			type: Number
		},
		executionTime: {
			type: Number,
    	default: globals.moment().format('x')
		}
	}],
	dateCreated: {
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
