const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createMessage = {
  body: Joi.object().keys({
    text: Joi.string().allow(null),
    senderId: Joi.number().required(),
    chatId: Joi.number().required(),
    offerId: Joi.number().allow(null),
    seen: Joi.boolean()
  }),
};

const getMessages = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getMessage = {
  params: Joi.object().keys({
    messageId: Joi.string().required(),
  }),
};

const updateMessage = {
  params: Joi.object().keys({
    messageId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteMessage = {
  params: Joi.object().keys({
    messageId: Joi.string().required(),
  }),
};

module.exports = {
  createMessage,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage,
};
