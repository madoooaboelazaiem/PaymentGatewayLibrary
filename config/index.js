const dotenv = require('dotenv');

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  //this must crash the application, since we don't have an .env file on which the application depends on
  throw new Error(
    "Couldn't find .env file! Please follow instructions from README.md",
  );
}

const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  mongoString: process.env.MONGO_STRING,
  paypalClientId: process.env.PAYPAL_CLIENT_ID,
  paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  host: process.env.HOST,
  swaggerHost: process.env.SWAGGER_HOST,
};
module.exports = { config };
