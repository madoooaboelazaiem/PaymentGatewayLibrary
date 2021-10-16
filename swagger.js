module.exports = {
  swagger: '2.0',
  explorer: true,
  securityDefinitions: {
    name: 'bearer',
    schema: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: '',
    },
    value: 'Bearer <my own JWT token>',
  },
  info: {
    version: '1.0.0',
    title: 'Paypal Payment Gateway Swagger',
    description: 'backend of Paypal Payment Gateway',
  },
  host: `${process.env.SWAGGER_HOST}`,
  basePath: '/',
  components: {
    securitySchemes: {
      bearer: {
        description: '',
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
  },
  security: {
    bearer: [],
  },
  tags: [
    {
      name: 'Home Page',
      description: 'Renders the payment form',
    },
    {
      name: 'Health Check',
      description: 'Checks that the backend is up and running successfully',
    },
    {
      name: 'Transactions',
      description: 'API for Transactions in the system',
    },
  ],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {
    '/': {
      get: {
        summary: 'Redirects to /payment which is the payment form integration',
        tags: ['Home Page'],
        parameters: [],
        produces: ['application/json'],
        responses: {
          200: {
            description: `Ok`,
          },
          400: {
            description: 'Error Occurred',
          },
        },
      },
    },
    '/payment': {
      get: {
        summary: 'Returns an html form containing the payment details',
        tags: ['Home Page'],
        parameters: [],
        produces: ['application/json'],
        responses: {
          200: {
            description: `Rendering html form`,
          },
          400: {
            description: 'Error Occurred',
          },
        },
      },
    },
    '/api/healthCheck': {
      get: {
        summary:
          'Returns a success or error message about the backend health condition',
        tags: ['Health Check'],
        parameters: [],
        produces: ['application/json'],
        responses: {
          200: {
            description: `{ db_connection: 'working', web_server: 'working' }`,
          },
          400: {
            description: 'Error Occurred',
          },
        },
      },
    },
    '/api/transaction/paymentRequest': {
      post: {
        summary: 'Create a payment order request',
        tags: ['Transactions'],
        parameters: [
          {
            in: 'body',
            name: 'Paypal Payment Request',
            description:
              'Creates a payment order and pay using the only Valid Card Number: 4032038989676386 with those available currencies USD, EUR, THB, HKD, SGD, AUD',
            schema: {
              properties: {
                price: {
                  type: 'integer',
                },
                fullname: {
                  type: 'string',
                },
                currency: {
                  type: 'string',
                  enum: ['USD', 'EUR', 'THB', 'HKD', 'SGD', 'AUD'],
                },
                cardnumber: {
                  type: 'integer',
                },
                expdate: {
                  type: 'string',
                  format: 'date',
                  pattern: /([0-9]{4})-(?:[0-9]{2})/,
                  example: '2026-11',
                },
                cvv: {
                  type: 'integer',
                },
              },
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          201: {
            description: 'Redirects to success format',
          },
          400: {
            description: 'Renders a failed feedback html file',
          },
        },
      },
    },
    '/api/transaction/success': {
      get: {
        summary: 'The redirection url of the payment order request',
        tags: ['Transactions'],
        parameters: [
          {
            in: 'query',
            name: 'token',
            description:
              'Order Id returned from the payment request used for capturing payment',
            type: 'string',
          },
          {
            in: 'query',
            name: 'Payer ID',
            description: 'THe id of the customer who requested the payment',
            type: 'string',
          },
        ],
        produces: ['application/json'],
        responses: {
          201: {
            description: 'Renders an html success feedback',
          },
          400: {
            description: 'Renders an html failure feedback',
          },
          404: {
            description: 'Failed. not found.',
          },
        },
      },
    },
    '/api/transaction/cancel': {
      get: {
        summary:
          'The cancellation url returned from the payment order request if failed',
        tags: ['Transactions'],
        parameters: [],
        produces: ['application/json'],
        responses: {
          201: {
            description: 'Renders an html failure feedback',
          },
          404: {
            description: 'Failed. not found.',
          },
        },
      },
    },
  },
  definitions: {
    Transactions: {
      type: 'object',
      properties: {
        orderId: {
          type: 'string',
        },
        fullName: {
          type: 'string',
        },
        price: {
          type: 'integer',
        },
      },
    },
  },
};
