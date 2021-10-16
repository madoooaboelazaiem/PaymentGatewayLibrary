const express = require('express');
const transactionController = require('../../controllers/transaction');
const router = express.Router();

router.post(
  '/transaction/paymentRequest',
  transactionController.createPaymentOrder,
);

router.get('/transaction/success', transactionController.showSuccess);

router.get('/transaction/cancel', transactionController.showFailure);

module.exports = {
  router,
};
