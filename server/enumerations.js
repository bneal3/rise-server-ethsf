// PURPOSE: Used to declare universal enumerations

var PLAYER_CATEGORIES = {
  human: "HUMAN",
  ai: "AI"
};

var UNIT_CATEGORIES = {
  infantry: "INFANTRY",
  calvary: "CALVARY",
  artillery: "ARTILLERY"
};

var GAME_STATUSES = {
  active: "ACTIVE",
  complete: "COMPLETE",
  error: "ERROR"
};

module.exports = { PLAYER_CATEGORIES, UNIT_CATEGORIES };
