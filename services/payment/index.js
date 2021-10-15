/* eslint-disable no-console */
const { createOrderRequest, captureOrder } = require('./paypal');
const creditPayment = async ({ request }) => {
  let { price, fullname, currency, cardnumber, expmonth, expyear, cvv } =
    request.body;
  const validateInputs =
    price &&
    fullname &&
    fullname.length !== 0 &&
    currency &&
    currency.length !== 0 &&
    cardnumber &&
    expmonth &&
    expyear &&
    cvv;

  if (!validateInputs) {
    return {
      success: false,
      status: 'INVALID_INPUTS',
    };
  }

  const getOrderId = await createOrderRequest({
    currency,
    price,
    fullname,
    cardnumber,
    expmonth,
    expyear,
    cvv,
  });
  if (!getOrderId || !getOrderId.result.id) {
    return {
      success: false,
      status: 'ERROR_OCCURRED',
    };
  } else {
    return {
      success: true,
      status: 'READY_FOR_PAYMENT',
      link: getOrderId.link,
    };
  }
};
const capturePayment = async ({ orderId }) => {
  const capturePayment = await captureOrder({ orderId });
  console.log(capturePayment);
  if (capturePayment && capturePayment.result.status === 'COMPLETED') {
    return { success: true, status: 'PAYMENT_SUCCESSFULL' };
  } else {
    return { success: false, status: 'PAYMENT_FAILED' };
  }
};

module.exports = { creditPayment, capturePayment };
