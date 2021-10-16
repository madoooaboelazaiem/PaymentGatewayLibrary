const { TransactionModel } = require('../models/transaction');

const createTransaction = async ({
  fullname,
  price,
  orderId,
  orderStatus,
  currency,
  response,
}) => {
  return await TransactionModel.create({
    fullname,
    price,
    orderId,
    currency,
    orderStatus: orderStatus,
    response,
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
