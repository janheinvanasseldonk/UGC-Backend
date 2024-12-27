const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createNotification = {
  body: Joi.object().keys({
    userId: Joi.number().required(),
    title: Joi.string().required(),
    text: Joi.string().allow(null || ''),
    orderId: Joi.number().allow(null || ''),
    creatorId: Joi.number().allow(null || ''),
  }),
};

const getNotificationById = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId).required(),
  }),
};

const getNotificationsByUserId = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  })
};

const updateNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      text: Joi.string(),
    })
    .min(1), // Ensure at least one field is updated
};

const deleteNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createNotification,
  getNotificationById,
  getNotificationsByUserId,
  updateNotification,
  deleteNotification,
};
