const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { Invoice, LineItem } = require("../models");
const { invoiceService } = require("../services");
const { Op } = require("sequelize");

const createInvoice = catchAsync(async (req, res) => {
  const invoiceData = req.body;

  const invoice = await Invoice.create(invoiceData, {
    include: [LineItem],
  });

  res.status(httpStatus.CREATED).send(invoice);
});

const getInvoices = catchAsync(async (req, res) => {
  const { fromDate, toDate } = req.query;
  const filter = pick(req.query, ["invoiceNumber", "buyerId", "creatorId"]);


  let filters = {
    ...filter,
    ...((fromDate && toDate) && {
      [Op.and]: [
        {
          invoiceDate: {
            [Op.lte]: new Date(`${toDate}T23:59:59.999Z`),
          },
        },
        {
          invoiceDate: {
            [Op.gte]: new Date(`${fromDate}T23:59:59.999Z`),
          },
        }
      ]
    }),
  }

  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const invoices = await invoiceService.queryInvoices(filters, options);

  res.send(invoices);
});


// const getUserInvoices = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ["invoiceNumber"]);
//   const options = pick(req.query, ["sortBy", "limit", "page"]);

//   const invoices = await Invoice.findAll({
//     where: filter,
//     order: options.sortBy ? [options.sortBy.split(":")] : [],
//     include: [LineItem],
//     limit: options.limit ? parseInt(options.limit, 10) : undefined,
//     offset: options.page
//       ? (parseInt(options.page, 10) - 1) * (options.limit || 10)
//       : undefined,
//   });

//   res.send(invoices);
// });

const getInvoice = catchAsync(async (req, res) => {
  const { invoiceId } = req.params;

  const invoice = await Invoice.findByPk(invoiceId, {
    include: [LineItem],
  });

  if (!invoice) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invoice not found");
  }

  res.send(invoice);
});

const updateInvoice = catchAsync(async (req, res) => {
  const { invoiceId } = req.params;
  const invoiceData = req.body;

  const [updatedCount, [updatedInvoice]] = await Invoice.update(invoiceData, {
    returning: true,
    where: { id: invoiceId },
  });

  if (updatedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invoice not found");
  }

  res.send(updatedInvoice);
});

const deleteInvoice = catchAsync(async (req, res) => {
  const { invoiceId } = req.params;

  const deletedCount = await Invoice.destroy({
    where: { id: invoiceId },
  });

  if (deletedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invoice not found");
  }

  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: "Invoice was successfully deleted",
  });
});

module.exports = {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
};
