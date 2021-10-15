const healthRouter = require('./health');
const homeRouter = require('./home');
module.exports.init = function (app) {
  app.use('/api', healthRouter.router);
  app.use('/', homeRouter.router);
};
