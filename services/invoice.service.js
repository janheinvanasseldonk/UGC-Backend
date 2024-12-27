const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { Invoice, LineItem } = require("../models/invoice.model"); // Import your models as needed
const paginate = require("../utils/paginate");

/**
 * Create an invoice
 * @param {Object} invoiceBody
 * @returns {Promise<Invoice>}
 */
const createInvoice = async (invoiceBody) => {
  // Create the invoice and its associated line items
  const invoice = await Invoice.create(invoiceBody, {
    include: [
      {
        model: LineItem,
        as: "lineItems", // Specify the alias here
      },
    ],
  });

  return invoice;
};

// const createPdfInvoice = async (invoiceId) => {};

/**
 * Query for invoices
 * @param {Object} filters - Filters to apply to the query
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<{ data: Invoice[], meta: { pagination: { page, pageSize, pageCount, total } } }>}
 */
const queryInvoices = async (filters, options) => {
  const { page, limit, sortBy } = options;

  const invoices = await Invoice.findAndCountAll({
    where: filters,
    include: [
      {
        model: LineItem,
        as: "lineItems", // Specify the alias here
      },
    ],
    ...paginate({ page, pageSize: limit }),
    order: [["createdAt", sortBy ? sortBy : "DESC"]],

  });

  return {
    data: invoices.rows,
    meta: {
      pagination: {
        page,
        pageSize: limit,
        pageCount: Math.ceil(invoices.count / limit),
        total: invoices.count,
      },
    },
  };
};

/**
 * Get an invoice by ID
 * @param {number} invoiceId
 * @returns {Promise<Invoice>}
 */
const getInvoiceById = async (invoiceId) => {
  // Find the invoice by ID with associated line items
  const invoice = await Invoice.findByPk(invoiceId, {
    include: [
      {
        model: LineItem,
        as: "lineItems", // Specify the alias here
      },
    ],
  });

  return invoice;
};

/**
 * Update an invoice by ID
 * @param {number} invoiceId
 * @param {Object} updateBody
 * @returns {Promise<Invoice>}
 */
const updateInvoiceById = async (invoiceId, updateBody) => {
  const invoice = await getInvoiceById(invoiceId);
  if (!invoice) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invoice not found");
  }

  // Update the invoice and its associated line items
  await invoice.update(updateBody, {
    include: [
      {
        model: LineItem,
        as: "lineItems", // Specify the alias here
      },
    ],
  });

  return invoice;
};

/**
 * Delete an invoice by ID
 * @param {number} invoiceId
 * @returns {Promise<void>}
 */
const deleteInvoiceById = async (invoiceId) => {
  const invoice = await getInvoiceById(invoiceId);
  if (!invoice) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invoice not found");
  }

  // Delete the invoice and its associated line items
  await invoice.destroy();

  return;
};

module.exports = {
  createInvoice,
  queryInvoices,
  getInvoiceById,
  updateInvoiceById,
  deleteInvoiceById,
};
