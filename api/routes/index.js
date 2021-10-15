const healthRouter = require('./health');
const homeRouter = require('./transaction');
module.exports.init = function (app) {
  app.use('/api', healthRouter.router);
  app.use('/', homeRouter.router);
};
