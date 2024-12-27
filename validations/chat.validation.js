const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createChat = {
  body: Joi.object().keys({
    creatorId: Joi.number().required(),
    userId: Joi.number().required(),
  }),
};

const getChat = {
  params: Joi.object().keys({
    chatId: Joi.string().required(),
  }),
};

const getChats = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getChatByUsers = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
    creatorId: Joi.string().required(),
  }),
};

const getChatsByUserId = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const updateChat = {
  params: Joi.object().keys({
    chatId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteChat = {
  params: Joi.object().keys({
    chatId: Joi.string().required(),
  }),
};

module.exports = {
  createChat,
  deleteChat,
  getChat,
  getChatByUsers,
  getChats,
  getChatsByUserId,
  updateChat,
};
