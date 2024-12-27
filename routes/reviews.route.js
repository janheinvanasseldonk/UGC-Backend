const auth = require("../middlewares/auth");
const express = require("express");
const reviewController = require("../controllers/review.controller");
const reviewValidation = require("../validations/review.validation");
const validate = require("../middlewares/validate");

const router = express.Router();

router
  .route("/")
  .post(validate(reviewValidation.createReview), reviewController.createReview)
  .get(validate(reviewValidation.getReviews), reviewController.getReviews);

router
  .route("/:reviewId")
  .get(validate(reviewValidation.getReview), reviewController.getReview)
  .patch(validate(reviewValidation.updateReview), reviewController.updateReview)
  .delete(
    validate(reviewValidation.deleteReview),
    reviewController.deleteReview
  );

module.exports = router;
