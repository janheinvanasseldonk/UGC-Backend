const Joi = require("joi");

const createInvoice = {
  body: Joi.object().keys({
    invoiceDate: Joi.date().required(),
    totalAmount: Joi.number().required(),
    creatorId: Joi.number().required(),
    buyerId: Joi.number().required(),
    orderId: Joi.number().required(),
    lineItems: Joi.array().items(
      Joi.object().keys({
        description: Joi.string().required(),
        priceExcludingTax: Joi.number().required(),
        taxAmount: Joi.number().required(),
        totalPriceWithTax: Joi.number().required(),
      })
    ),
  }),
};

const getInvoices = {
  query: Joi.object().keys({
    invoiceNumber: Joi.string(),
    sortBy: Joi.string(),
    fromDate: Joi.string(),
    toDate: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    userRole: Joi.string(),
    creatorId: Joi.number(),
    buyerId: Joi.number(),


  }),
};

const getInvoice = {
  params: Joi.object().keys({
    invoiceId: Joi.number().integer().required(),
  }),
};

const updateInvoice = {
  params: Joi.object().keys({
    invoiceId: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    invoiceDate: Joi.date(),
    totalAmount: Joi.number(),
    fileUrl: Joi.string(),
    lineItems: Joi.array().items(
      Joi.object().keys({
        description: Joi.string(),
        priceExcludingTax: Joi.number(),
        taxAmount: Joi.number(),
        totalPriceWithTax: Joi.number(),
      })
    ),
  }),
};

const deleteInvoice = {
  params: Joi.object().keys({
    invoiceId: Joi.number().integer().required(),
  }),
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
};
