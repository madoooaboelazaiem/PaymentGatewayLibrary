/* eslint-disable no-console */
const { createOrderRequest, captureOrder } = require('./paypal');
const creditPayment = async ({ request }) => {
  let { price, fullname, currency, cardnumber, expdate, cvv } = request.body;
  const usedCurrencies = ['USD', 'EUR', 'THB', 'HKD', 'SGD', 'AUD'];
  const validateInputs =
    price &&
    fullname &&
    fullname.length !== 0 &&
    cardnumber &&
    expdate &&
    cvv &&
    currency &&
    currency.length !== 0;
  const validateCurrency = usedCurrencies.includes(currency);
  const checkCardExpiration = new Date(expdate) >= new Date('2026-11');
  if (!validateInputs) {
    return {
      success: false,
      status: 'INVALID_INPUTS',
    };
  }
  if (!validateCurrency) {
    return {
      success: false,
      status: 'WRONG_CURRENCY',
    };
  }
  if (!checkCardExpiration) {
    return {
      success: false,
      status: 'CARD_EXPIRED',
    };
  }
  const getOrderAndPay = await createOrderRequest({
    currency,
    price,
    fullname,
    cardnumber,
    expdate,
    cvv,
  });
  if (!getOrderAndPay || getOrderAndPay.statusCode != '201') {
    return {
      success: false,
      status: 'ERROR_OCCURRED',
    };
  } else {
    return {
      success: true,
      status: 'PAID_SUCCESSFULLY',
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
