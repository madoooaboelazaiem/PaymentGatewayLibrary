/* eslint-disable no-console */
const express = require('express');
const events = require('./subscribers/events');
const expressInit = require('./loaders/index');
const { config } = require('./config');

function setServerPort(expressServer, port) {
  const normalizedPort = normalizePort(port);
  expressServer.set('port', normalizedPort);
  return normalizedPort;
}

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }
  return false;
}

async function startServer() {
  const app = express();

  await expressInit(app);

  const port = setServerPort(app, config.port || '3000');
  // listen on provided port on all network interfaces
  const server = app.listen(port, null, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Your server is ready !`);
  });
  server.on('error', (error) => events.api.onError(error, port));
  server.on('listening', () => events.api.onListening(server));
}

startServer().catch((err) => {
  console.log('Server error: ' + err);
});
