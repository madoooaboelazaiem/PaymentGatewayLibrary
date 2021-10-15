const { TransactionModel } = require('../models/transaction');

const createTransaction = async ({ fullname, price, orderId, currency }) => {
  return await TransactionModel.create({
    fullname,
    price,
    orderId,
    currency,
    orderStatus: 'READY_FOR_PAYMENT',
  });
};

const updateTransaction = async ({ orderId, orderStatus }) => {
  return await TransactionModel.findOneAndUpdate(
    { orderId },
    { orderStatus },
    {
      new: true,
    },
  );
};
const getOrderDetails = async ({ orderId }) => {
  const doc = await this.model.findOne({ orderId });
  return doc;
};
module.exports = { createTransaction, updateTransaction, getOrderDetails };
