const path = require('path');

async function redirectToHomepage(req, res, next) {
  try {
    return res.redirect('/payment');
  } catch (e) {
    next(e);
  }
}
async function renderPaymentForm(req, res, next) {
  try {
    const thisDirectory = path.resolve(path.dirname(''));
    res
      .status(200)
      .sendFile(path.join(thisDirectory + '/public/html/', 'index.html'));
  } catch (e) {
    next(e);
  }
}
module.exports = {
  renderPaymentForm,
  redirectToHomepage,
};
