/* eslint-disable no-console */
const paypal = require('@paypal/checkout-server-sdk');
const { config } = require('../../config');
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

function buildRequestBody({ currency, price, fullname }) {
  return {
    intent: 'CAPTURE',
    application_context: {
      return_url: config.host + '/success',
      cancel_url: config.host + '/cancel',
      brand_name: 'EXAMPLE INC',
      locale: 'en-US',
      landing_page: 'BILLING',
      user_action: 'CONTINUE',
    },
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: price,
        },
      },
    ],
  };
}
const createOrderRequest = async ({
  currency,
  price,
  fullname,
  cardnumber,
  expmonth,
  expyear,
  cvv,
}) => {
  try {
    // Construct a request object and set desired parameters
    // Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
    let request = new paypal.orders.OrdersCreateRequest();
    request.headers['prefer'] = 'return=representation';
    let bodyParams = buildRequestBody({ currency, price, fullname });

    // Call API with your client and get a response for your call
    request.requestBody(bodyParams);
    let response = await client.execute(request);
    //   console.log(`Response: ${JSON.stringify(response)} \n`);

    // If call returns body in response, you can get the deserialized version from the result attribute of the response.
    // console.log(`Order: ${JSON.stringify(response.result)} \n`);
    console.log('OrdersCreateRequest ');
    console.log('Status Code: ' + response.statusCode);
    console.log('Status: ' + response.result.status);
    console.log('Order ID: ' + response.result.id);
    console.log('Intent: ' + response.result.intent);
    console.log('Links: ');
    response.result.links.forEach((item, index) => {
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
      });
    }
    return response;
  } catch (e) {
    console.log(e);
  }
};

let captureOrder = async function ({ req, res }) {
  try {
    let paymentId = req.query.token;
    let request = new paypal.orders.OrdersCaptureRequest(paymentId);
    request.requestBody({});
    // Call API with your client and get a response for your call
    let response = await client.execute(request);
    console.log(response);
    //   console.log(`Response: ${JSON.stringify(response)} \n`);
    // If call returns body in response, you can get the deserialized version from the result attribute of the response.
    console.log('OrdersCaptureRequest ');
    console.log('Status Code: ' + response.statusCode);
    console.log('Status: ' + response.result.status);
    console.log('Capture ID: ' + response.result.id);
    console.log('Links:');
    response.result.links.forEach((item, index) => {
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
        orderStatus: 'PAID_SUCCESSFULLY',
      });
    } else {
      updateTransaction({
        orderId: response.result.id,
        orderStatus: 'PAYMENT_FAILED',
      });
    }
    return response;
  } catch (e) {
    console.log(e);
  }
};

module.exports = { createOrderRequest, captureOrder };
