const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  // the reference to the customer/merchant/admin object
  fullname: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
});

const TransactionModel = mongoose.model('Transaction', transactionSchema);
module.exports = { TransactionModel };
