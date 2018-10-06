// FUNCTION: Logs the method and ip of the route to the console
var serverlog = (req, res, next) => {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('\n' + req.method + ' ' + req.originalUrl + ' ' + ip);
  req.ip = ip;
  next();
};

module.exports = {serverlog};
