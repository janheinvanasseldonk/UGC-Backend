const auth = require("../middlewares/auth");
const express = require("express");
const offerController = require("../controllers/offers.controller");
const offerValidation = require("../validations/offers.validation");
const validate = require("../middlewares/validate");

const router = express.Router();

router
  .route("/")
  .post(validate(offerValidation.createOffer), offerController.createOffer)
  .get(validate(offerValidation.getOffers), offerController.getOffers);

router
  .route("/:offerId")
  .get(validate(offerValidation.getOffer), offerController.getOffer)
  .patch(validate(offerValidation.updateOffer), offerController.updateOffer)
  .delete(validate(offerValidation.deleteOffer), offerController.deleteOffer);

module.exports = router;
