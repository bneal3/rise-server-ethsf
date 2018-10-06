var globals = require('./../globals');
var enumerations = require('./../enumerations');
var _ = require('lodash');

var PlayerSchema = new globals.mongoose.Schema({
  // NOTE: Name of Player
  publickey: {
    type: String,
    default: ""
  },
  username: {
    type: String,
    default: ""
  },
  // NOTE: Account password
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // NOTE: Link to avatar
  avatar: {
    type: String,
    default: ""
  },
  // NOTE: Array of access tokens
  tokens: [{
    // NOTE: Type of access (auth, lock)
    access: {
      type: String,
      required: true
    },
    // NOTE: Actual token
    token: {
      type: String,
      default: ''
    },
    // NOTE: Time issued
    issueTime: {
      type: Number,
      default: globals.moment().format('x')
    }
  }],
  // NOTE: Registration time of Player
  registrationTime: {
    type: Number,
    default: globals.moment().format('x')
  }
});

// USAGE: What gets returned when converting to JSON
PlayerSchema.methods.toJSON = function () {
  var player = this;
  var playerObject = player.toObject();

  return _.pick(playerObject, ['_id', 'username', 'avatar']);
};

// USAGE: Get Id
PlayerSchema.methods.getId = function () {
  var player = this;

  return player._id.toString();
};

// USAGE: Generates token with a specific access (auth, lock)
PlayerSchema.methods.generateToken = function (access) {
  var player = this;
  var token = jwt.sign({_id: player._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  player.tokens.push({access, token});

  return player.save().then(() => {
    return token;
  });
};

// FUNCTION: Deactivates all tokens of a certain type.
// Player should only have 1 of either an auth or lock token at anytime.
// It makes sense to deactivate all tokens whenever a deactivation is needed.
// Deactivate means token is deleted.
PlayerSchema.methods.deactivateTokens = function (access) {
  var player = this;

  // FLOW: Deactivate tokens
  player.tokens.forEach((token) => {
    if(token.access === access){
      if(token.token){
        console.log(token.token);
        token.token = undefined;
      }
    }
  });

  return player.save();
};

// USAGE: Finds a Player by a specified token (usually used in authentication middleware)
PlayerSchema.statics.findByToken = function (access, token) {
  var Player = this;
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return Player.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': access
  });
};

// USAGE: Finds a Player by their login credentials
PlayerSchema.statics.findByCredentials = function (username, password) {
  var Player = this;

  return Player.findOne({
    'username': username
  }).then((player) => {
    if (!player) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and Player.password
      bcrypt.compare(password, player.password, (err, res) => {
        if (res) {
          resolve(player);
        } else {
          reject();
        }
      });
    });
  });
};

// FUNCTION: Formats data before entering into database
PlayerSchema.pre('save', function (next) {
  var player = this;

  // FLOW: Salts and hashes password before entering it into database
  if (player.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(player.password, salt, (err, hash) => {
        player.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var Player = globals.mongoose.model('Player', PlayerSchema);

module.exports = {Player};
