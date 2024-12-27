const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const Order = require("../models/order.model");
const paginate = require("../utils/paginate");
const Package = require("../models/package.model");
const { User, Offer } = require("../models");
const { Invoice } = require("../models/invoice.model");
const Review = require("../models/review.model");

/**
 * Create a order
 * @param {Object} orderBody
 * @returns {Promise<order>}
 */
const createOrder = async (orderBody) => {
  return await Order.create(orderBody);
};

/**
 * Query for orders
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOrders = async (filters, options) => {
  const { page, limit, sortBy } = options;
  console.log(page)

  const orders = await Order.findAndCountAll({
    where: filters,
    ...paginate({ page, pageSize: limit }),
    order: [["createdAt", sortBy ? sortBy : "DESC"]],
    include: [
      { model: Package },
      { model: Offer },
      { model: User, as: "user" },
      { model: User, as: "creator" },
      { model: Invoice },
    ],
  });

  return {
    data: orders.rows,
    meta: {
      pagination: {
        page,
        pageSize: limit,
        pageCount: Math.ceil(orders.count / limit),
        total: orders.count,
      },
    },
  };
};

/**
 * Get order by id
 * @param {ObjectId} id
 * @returns {Promise<Order>}
 */
const getOrderById = async (id) => {
  const order = await Order.findOne({
    where: { id },
    include: [
      { model: Package },
      { model: Offer },
      { model: User, as: "user" },
      { model: User, as: "creator" },
      { model: Review },
    ],
  });

  return order;
};

/**
 * Update order by id
 * @param {ObjectId} orderId
 * @param {Object} updateBody
 * @returns {Promise<order>}
 */
const updateOrderById = async (orderId, updateBody) => {
  const order = await getOrderById(orderId);

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  Object.assign(order, updateBody);
  await order.save();

  return order;
};

/**
 * Delete order by id
 * @param {ObjectId} orderId
 * @returns {Promise<Order>}
 */
const deleteOrderById = async (orderId) => {
  const order = await getOrderById(orderId);

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "order not found");
  }

  const deletedOrder = await Order.destroy({ where: { id: orderId } });

  return deletedOrder;
};

module.exports = {
  createOrder,
  queryOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
};
