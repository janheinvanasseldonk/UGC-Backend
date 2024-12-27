const auth = require("../middlewares/auth");
const express = require("express");
const activityController = require("../controllers/activity.controller");
const activityValidation = require("../validations/activity.validation");
const validate = require("../middlewares/validate");
const multer = require("multer");
const upload = require("../utils/multer");

const router = express.Router();

router
  .route("/")
  .post(
    upload.fields([
      { name: "attachment" }
    ]),
    validate(activityValidation.createActivity),
    activityController.createActivity);

router
  .route("/:orderId")
  .get(validate(activityValidation.getActivityByOrderId), activityController.getActivityByOrderId)
  .patch(validate(activityValidation.updateActivity), activityController.updateActivityById);

router
.route('/:orderId/:userId')
.get(activityController.getActivityCount)
module.exports = router;
