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
      name: 'Users',
      description: 'API for Users in the system',
    },
  ],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {},
  // hook
  definitions: {
    Users: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
        fullName: {
          type: 'string',
        },
      },
    },
  },
};
