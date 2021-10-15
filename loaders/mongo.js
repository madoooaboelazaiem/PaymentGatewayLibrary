/* eslint-disable no-console */
const mongoose = require('mongoose');
const { config } = require('../config');
async function mongoLoader() {
  await mongoose
    .connect(config.mongoString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(async (res) => {
      // eslint-disable-next-line no-console
      console.log('Connected to MongoDB!');

      return res.connection;
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      console.log('MongoDB error: ' + err);
    });
}

module.exports = { mongoLoader };
