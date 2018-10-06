// PURPOSE: Entry point of server

// Module Dependencies
var globals = require('./globals');
var enumerations = require('./enumerations');
var _ = require('lodash');
var fs = require('fs');

// Server Dependencies
const PORT = process.env.PORT;
var express = require('express');
var app = express();
var server = require('http').Server(app);

// Package Dependencies
const bodyParser = require('body-parser');
const helmet = require('helmet');

// Middleware
var {serverlog} = require('./middleware/serverlog');

// ROUTES
var players = require('./routes/players');
var games = require('./routes/games');

//******************
// SERVER
//******************

// Use
app.use(serverlog);
app.use(bodyParser.json());

// Security
app.disable('x-powered-by');
app.use(helmet());

// Routes
app.use('/players', players);
app.use('/games', games);

// SERVER INITIALIZATION
server.listen(PORT, function() {
	console.log('Server started...');
});
