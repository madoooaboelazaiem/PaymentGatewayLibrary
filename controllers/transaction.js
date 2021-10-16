const path = require('path');
const { creditPayment } = require('../services/payment');
const { captureOrder } = require('../services/payment/paypal');

async function createPaymentOrder(req, res, next) {
  try {
    const paymentRequest = await creditPayment({ request: req, response: res });
    if (paymentRequest.success) {
      showSuccess(req, res, next);
      // res.redirect(paymentRequest.link);
    } else {
      showFailure(req, res, next);
    }
  } catch (e) {
    next(e);
  }
}
async function capturePayment(req, res, next) {
  try {
    const pay = await captureOrder({ req, res });
    if (pay && pay.statusCode == '201') {
      showSuccess(req, res, next);
    } else {
      showFailure(req, res, next);
    }
  } catch (e) {
    next(e);
  }
}
async function showSuccess(req, res, next) {
  try {
    const thisDirectory = path.resolve(path.dirname(''));
    return res
      .status(201)
      .sendFile(
        path.join(thisDirectory + '/public/html/', 'paymentSuccess.html'),
      );
  } catch (e) {
    next(e);
  }
}
async function showFailure(req, res, next) {
  try {
    const thisDirectory = path.resolve(path.dirname(''));
    return res
      .status(201)
      .sendFile(
        path.join(thisDirectory + '/public/html/', 'paymentFailed.html'),
      );
  } catch (e) {
    next(e);
  }
}
module.exports = {
  createPaymentOrder,
  capturePayment,
  showFailure,
  showSuccess,
};
