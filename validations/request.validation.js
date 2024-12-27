const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createRequest = {
  body: Joi.object().keys({
    nameOfProduct: Joi.string().required(),
    description: Joi.string().required(),
    uitspraak: Joi.string().required(),
    gender: Joi.string().required(),
    nationality: Joi.string().required(),
    age: Joi.number().integer(),
    language: Joi.string(),
    height: Joi.number().integer(),
    hairStyle: Joi.string(),
    bodyType: Joi.string(),
    budget: Joi.string(),
  }),
};

const getRequests = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getRequest = {
  params: Joi.object().keys({
    RequestId: Joi.string().required(),
  }),
};

const updateRequest = {
  params: Joi.object().keys({
    RequestId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      nameOfProduct: Joi.string().required(),
      description: Joi.string().required(),
      uitspraak: Joi.string().required(),
      gender: Joi.string().required(),
      nationality: Joi.string().required(),
      age: Joi.number().integer(),
      language: Joi.string(),
      height: Joi.number().integer(),
      hairStyle: Joi.string(),
      bodyType: Joi.string(),
      budget: Joi.string(),
    })
    .min(1),
};

const deleteRequest = {
  params: Joi.object().keys({
    RequestId: Joi.string().required(),
  }),
};

module.exports = {
  createRequest,
  getRequests,
  getRequest,
  updateRequest,
  deleteRequest,
};
