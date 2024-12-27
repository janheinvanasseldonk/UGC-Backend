const express = require("express");
const notificationValidation = require("../validations/notifications.validation");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const { notificationController } = require("../controllers");

const router = express.Router();

// Route to create a notification
router
    .route("/")
    .post(
        auth(), // Middleware to ensure user is authenticated
        validate(notificationValidation.createNotification),
        notificationController.createNotification
    );

// Route to get notifications by userId
router
    .route("/user/:userId")
    .get(
        auth(),
        validate(notificationValidation.getNotificationsByUserId),
        notificationController.getNotifications
    );

// Route to get a single notification by its ID
router
    .route("/:notificationId")
    .patch(
        auth(),
        validate(notificationValidation.updateNotification),
        notificationController.updateNotification
    )
    .delete(
        // auth(),
        validate(notificationValidation.deleteNotification),
        notificationController.deleteNotification
    );

module.exports = router;
