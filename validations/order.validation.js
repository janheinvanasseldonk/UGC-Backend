const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createOrder = {
  body: Joi.object().keys({
    scriptFile: Joi.string().allow(null),
    sceneLocation: Joi.string().allow(null),
    extraInformation: Joi.string(),
    fastDelivery1Day: Joi.boolean(),
    paymentMethod: Joi.string().allow(null),
    creatorId: Joi.number().integer().required(),
    buyerId: Joi.number().integer().required(),
    packageId: Joi.number().integer().allow(null),
    offerId: Joi.number().integer().allow(null),
    totalAmount: Joi.number(),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    buyerId: Joi.number().integer(),
    creatorId: Joi.number().integer(),
    userRole: Joi.string(),
    userId: Joi.string(),
    status: Joi.string(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().required(),
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      scriptFile: Joi.string(),
      sceneLocation: Joi.string(),
      extraInformation: Joi.string(),
      fastDelivery1Day: Joi.boolean(),
      paymentMethod: Joi.string(),
      creatorId: Joi.number(),
      status: Joi.string(),
      buyerId: Joi.number,
      script: Joi.string(),
      briefing: Joi.string(),
      attachment: Joi.any(),
      submittedVideos: Joi.any(),
      submission: Joi.any()
    })
    .min(1),
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().required(),
  }),
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
