const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.js');
const swaggerJSDoc = require('swagger-jsdoc');
const { config } = require('../config/index.js');

// swagger definition
const swaggerDefinition = {
  info: {
    title: 'Payment Gateway Integration',
    version: '1.0.0',
    description: 'backend of paypal payment gateway',
  },
  host: `http://localhost:${config.port}`,
  basePath: '/',
};
// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./controllers/*.js'], // pass all in array
};
// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

function load(app) {
  app.get('/swagger.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

module.exports = {
  load,
};
