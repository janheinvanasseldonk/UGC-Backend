const express = require("express");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const { onesignalController } = require("../controllers");
const onesignalValidation = require("../validations/onesignal.validation");

const router = express.Router();

/**
 * Route to send a notification to specific users
 */
router
    .route("/send")
    .post(
        // auth(),
        validate(onesignalValidation.sendNotification),
        onesignalController.sendNotificationController
    );

module.exports = router;
