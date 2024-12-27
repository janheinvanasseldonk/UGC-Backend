const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createReview = {
  body: Joi.object().keys({
    text: Joi.string(),
    stars: Joi.number().required(),
    orderId: Joi.number().integer().required(),
    userId: Joi.number().integer().required(),
  }),
};

const getReviews = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    niches: Joi.string(),
  }),
};

const getReview = {
  params: Joi.object().keys({
    ReviewId: Joi.string().required(),
  }),
};

const updateReview = {
  params: Joi.object().keys({
    ReviewId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteReview = {
  params: Joi.object().keys({
    ReviewId: Joi.string().required(),
  }),
};

module.exports = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
};
