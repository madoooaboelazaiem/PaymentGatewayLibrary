const healthRouter = require('./health');
const transactions = require('./transaction');
const homeRouter = require('./home');
module.exports.init = function (app) {
  app.use('/api', healthRouter.router);
  app.use('/', homeRouter.router);
  app.use('/api', transactions.router);
};
