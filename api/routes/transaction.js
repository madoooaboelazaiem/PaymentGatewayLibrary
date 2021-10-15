const express = require('express');
const path = require('path');
const { creditPayment } = require('../../services/payment');
const { captureOrder } = require('../../services/payment/paypal');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  return res.redirect('/payment');
});
router.get('/payment', (req, res) => {
  const thisDirectory = path.resolve(path.dirname(''));
  res.sendFile(path.join(thisDirectory + '/public/html/', 'index.html'));
});

router.post('/paymentRequest', async (req, res) => {
  const paymentRequest = await creditPayment({ request: req, response: res });
  if (paymentRequest.success) {
    res.redirect(paymentRequest.link);
  } else {
    return res
      .status(400)
      .sendFile(
        path.resolve(__dirname + '../../../public/html/paymentFailed.html'),
      );
  }
});

router.get('/success', async (req, res) => {
  const pay = await captureOrder({ req, res });
  if (pay && pay.statusCode == '201') {
    return res
      .status(201)
      .sendFile(
        path.resolve(__dirname + '../../../public/html/paymentSuccess.html'),
      );
  } else {
    return res
      .status(400)
      .sendFile(
        path.resolve(__dirname + '../../../public/html/paymentFailed.html'),
      );
  }
});

router.get('/cancel', (req, res) => {
  return res
    .status(201)
    .sendFile(
      path.resolve(__dirname + '../../../public/html/paymentFailed.html'),
    );
});

module.exports = {
  router,
};
