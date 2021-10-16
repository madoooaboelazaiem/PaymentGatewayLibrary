const cors = require('cors');

function load(app) {
  // TODO must be changed for security
  app.options('*', cors()); // include before other routes
  app.use(cors());
}

module.exports = {
  load,
};
