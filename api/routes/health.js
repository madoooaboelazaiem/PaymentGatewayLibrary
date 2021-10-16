const express = require('express');
const healthController = require('../../controllers/health');
const router = express.Router();

router.get('/healthCheck', healthController.healthCheck);
module.exports = {
  router,
};
