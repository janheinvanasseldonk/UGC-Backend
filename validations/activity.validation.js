const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createActivity = {
  body: Joi.object().keys({
    message: Joi.string().allow(null),
    update: Joi.string().allow(null),
    ugc: Joi.boolean().allow(null),
    attachment: Joi.any(),
    userId: Joi.number().integer(),
    orderId: Joi.number().integer(),
    seen: Joi.boolean().allow(null),
  }),
};

const updateActivity = {
  body: Joi.object().keys({
    message: Joi.string().allow(null),
    update: Joi.string().allow(null),
    ugc: Joi.boolean().allow(null),
    attachment: Joi.any(),
    userId: Joi.number().integer(),
    orderId: Joi.number().integer(),
    seen: Joi.boolean().allow(null),
  }),
};

const getActivityByOrderId = {
  query: Joi.object().keys({
    orderId: Joi.number().integer()
  }),
};


module.exports = {
    createActivity,
    getActivityByOrderId,
    updateActivity
  };
  