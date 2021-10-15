const { expressLoader } = require('./express');
const { mongoLoader } = require('./mongo');
const router = require('../api/routes/index');
const swagger = require('./swagger');
const cors = require('./cors');
async function init(expressApp) {
  expressLoader(expressApp);
  mongoLoader();
  swagger.load(expressApp);
  cors.load(expressApp);
  router.init(expressApp);
}

module.exports = init;
