const express = require('express');
const path = require('path');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  return res.redirect('/payment');
});
router.get('/payment', function (req, res) {
  const thisDirectory = path.resolve(path.dirname(''));
  res.sendFile(path.join(thisDirectory + '/public/', 'index.html'));
});

module.exports = {
  router,
};
