var globals = require('./../../globals');
var enumerations = require('./../../enumerations');
var _ = require('lodash');

var TerritorySchema = new globals.mongoose.Schema({
	mapId: {
		type: String,
		required: true
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
	}],
	lastBattle: {
		type: Number
	}
});

// USAGE: Get Id
TerritorySchema.methods.getId = function () {
  var territory = this;

  return territory._id.toString();
};

var Territory = globals.mongoose.model('Territory', TerritorySchema);

module.exports = {Territory};
