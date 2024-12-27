const auth = require("../middlewares/auth");
const express = require("express");
const invoiceController = require("../controllers/invoice.controller");
const invoiceValidation = require("../validations/invoice.validation");
const validate = require("../middlewares/validate");

const router = express.Router();

// Create a new invoice
router.post(
  "/",
  validate(invoiceValidation.createInvoice),
  invoiceController.createInvoice
);

// Get a list of invoices
router.get(
  "/",
  // auth, // Add authentication middleware if needed
  validate(invoiceValidation.getInvoices),
  invoiceController.getInvoices
);

// Get a specific invoice by ID
router.get(
  "/:invoiceId",
  auth, // Add authentication middleware if needed
  validate(invoiceValidation.getInvoice),
  invoiceController.getInvoice
);

// Update a specific invoice by ID
router.patch(
  "/:invoiceId",
  auth, // Add authentication middleware if needed
  validate(invoiceValidation.updateInvoice),
  invoiceController.updateInvoice
);

// Delete a specific invoice by ID
router.delete(
  "/:invoiceId",
  auth, // Add authentication middleware if needed
  validate(invoiceValidation.deleteInvoice),
  invoiceController.deleteInvoice
);

module.exports = router;
