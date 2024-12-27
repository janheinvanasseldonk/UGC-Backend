const auth = require("../middlewares/auth");
const express = require("express");
const orderController = require("../controllers/order.controller");
const orderValidation = require("../validations/order.validation");
const validate = require("../middlewares/validate");
const multer = require("multer");
const upload = multer();

const router = express.Router();

router
  .route("/")
  .post(upload.single("scriptFile"), orderController.createOrder)
  .get(validate(orderValidation.getOrders), orderController.getOrders);

router
  .route("/:orderId")
  .get(validate(orderValidation.getOrder), orderController.getOrder)
  .put(upload.array("attachment"), orderController.updateOrder)
  .delete(
    auth(),
    validate(orderValidation.deleteOrder),
    orderController.deleteOrder
  );

module.exports = router;
