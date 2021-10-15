const express = require('express');
const healthController = require('../../controllers/healthController');
const router = express.Router();

router.get('/health_check', healthController.healthCheck);
module.exports = {
  router,
};
