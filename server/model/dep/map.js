var globals = require('./../globals');
var enumerations = require('./../enumerations');
var _ = require('lodash');

var MapSchema = new globals.mongoose.Schema({
	gameId: {
		type: String,
		required: true
	}
});

// USAGE: Get Id
MapSchema.methods.getId = function () {
  var map = this;

  return map._id.toString();
};

var Map = globals.mongoose.model('Map', MapSchema);

module.exports = {Map};
