const cookieParser = require('cookie-parser');
const logger = require('morgan');
const express = require('express');
const path = require('path');

function expressLoader(expressApp) {
  // load middlewares
  expressApp.use(logger('dev'));
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: false }));
  expressApp.use(cookieParser());

  // add static folders
  const thisDirectory = path.resolve(path.dirname(''));
  expressApp.use(
    express.static(path.join(thisDirectory + '../../client/web', 'build')),
  );
}

module.exports = { expressLoader };
