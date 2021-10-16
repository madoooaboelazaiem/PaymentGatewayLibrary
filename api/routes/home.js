const express = require('express');
const router = express.Router();
const homePageController = require('../../controllers/home');

/* GET home page. */
router.get('/', homePageController.redirectToHomepage);
router.get('/payment', homePageController.renderPaymentForm);

module.exports = {
  router,
};
