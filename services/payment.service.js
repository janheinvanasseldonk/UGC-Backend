const { mollieClient } = require("../config/mollie");

/**
 * Create a payment from Mollie
 * @param {Object} paymentBody
 * @returns {Promise<Payment>}
 */
const createPayment = async (paymentBody) => {
  const payment = await mollieClient.payments.create(paymentBody);

  return payment;
};

module.exports = {
  createPayment,
};
