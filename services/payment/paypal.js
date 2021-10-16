/* eslint-disable no-console */
const paypal = require('@paypal/checkout-server-sdk');
const { config } = require('../../config');
const uuid = require('uuid');

const {
  createTransaction,
  updateTransaction,
} = require('../../dbm/transaction');
// Creating an environment
let clientId = config.paypalClientId;
let clientSecret = config.paypalClientSecret;
// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

function buildRequestBody({
  currency,
  price,
  fullname,
  cardnumber,
  expdate,
  cvv,
}) {
  return {
    intent: 'CAPTURE',
    application_context: {
      return_url: config.host + '/api/transaction/success',
      cancel_url: config.host + '/api/transaction/cancel',
      brand_name: 'EXAMPLE INC',
      locale: 'en-US',
      landing_page: 'BILLING',
      user_action: 'CONTINUE',
    },
    payer: {
      name: {
        given_name: fullname,
        surname: fullname,
      },
    },
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: price,
        },
      },
    ],
    payment_source: {
      card: {
        number: cardnumber,
        expiry: expdate,
        security_code: cvv,
        name: fullname,
      },
    },
  };
}
const createOrderRequest = async ({
  currency,
  price,
  fullname,
  cardnumber,
  expdate,
  cvv,
}) => {
  try {
    let { convertedPrice, convertedCurrency } = currencyConverter({
      currency,
      price,
    });
    // Construct a request object and set desired parameters
    // Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
    let request = new paypal.orders.OrdersCreateRequest();
    request.headers['prefer'] = 'return=representation';
    request.headers['PayPal-Request-Id'] = uuid.v4();
    let bodyParams = buildRequestBody({
      currency: convertedCurrency,
      price: convertedPrice,
      fullname,
      cardnumber,
      expdate,
      cvv,
    });

    // Call API with your client and get a response for your call
    request.requestBody(bodyParams);
    let response = await client.execute(request);
    let responseMessage = `Status Code:  + ${response.statusCode}
    Status:   ${response.result.status}
    Order ID:   ${response.result.id}
    Intent:  ${response.result.intent}
    Gross Amount: ${response.result.purchase_units[0].amount.currency_code} ${response.result.purchase_units[0].amount.value},
    `;
    console.log('OrdersCreateRequest ');
    console.log(responseMessage);
    console.log('Links: ');
    response.result.links.forEach((item) => {
      if (item.rel === 'approve') {
        response.link = item.href;
      }
      let rel = item.rel;
      let href = item.href;
      let method = item.method;
      let message = `\t${rel}: ${href}\tCall Type: ${method}`;
      console.log(message);
    });
    console.log(
      `Gross Amount: ${response.result.purchase_units[0].amount.currency_code} ${response.result.purchase_units[0].amount.value}`,
    );
    if (response.statusCode == '201') {
      createTransaction({
        fullname,
        price,
        currency,
        orderId: response.result.id,
        orderStatus: response.result.status,
        response: responseMessage,
      });
    }
    return response;
  } catch (e) {
    console.log('In Request');
    console.log(e);
  }
};

let captureOrder = async function ({ req, orderId }) {
  try {
    let paymentId = orderId || req.query.token;
    let request = new paypal.orders.OrdersCaptureRequest(paymentId);
    request.requestBody({});
    // Call API with your client and get a response for your call
    let response = await client.execute(request);
    console.log(response);
    // If call returns body in response, you can get the deserialized version from the result attribute of the response.
    console.log('OrdersCaptureRequest ');
    console.log('Status Code: ' + response.statusCode);
    console.log('Status: ' + response.result.status);
    console.log('Capture ID: ' + response.result.id);
    console.log('Links:');
    response.result.links.forEach((item) => {
      let rel = item.rel;
      let href = item.href;
      let method = item.method;
      let message = `\t${rel}: ${href}\tCall Type: ${method}`;
      console.log(message);
    });
    // To toggle print the whole body comment/uncomment the below line
    //   console.log(JSON.stringify(response.result, null, 4));
    if (response.statusCode == 201) {
      updateTransaction({
        orderId: response.result.id,
        orderStatus: 'PAYMENT_SUCCESSFULL',
      });
    } else {
      updateTransaction({
        orderId: response.result.id,
        orderStatus: 'PAYMENT_FAILED',
      });
    }
    return response;
  } catch (e) {
    console.log('In Capture');
    console.log(e);
  }
};

const currencyConverter = ({ currency, price }) => {
  let convertedPrice = 0;
  let convertedCurrency = null;
  switch (currency) {
    case 'THB':
      convertedPrice = Math.round((price * 100.0) / 33.41) / 100;
      convertedCurrency = 'USD';
      break;
    case 'HKD':
      convertedPrice = Math.round((price * 100.0) / 7.78) / 100;
      convertedCurrency = 'USD';
      break;

    case 'SGD':
      convertedPrice = Math.round((price * 100.0) / 1.35) / 100;
      convertedCurrency = 'USD';
      break;
    default:
      convertedPrice = Math.round(price * 100.0) / 100;
      convertedCurrency = currency;
      break;
  }
  return { convertedPrice, convertedCurrency };
};
module.exports = { createOrderRequest, captureOrder };
