const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { notificationService } = require("../services");

/**
 * Create a notification
 */
const createNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.createNotification(req.body);

  if (!notification) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to create notification!",
    });
  }

  res.status(httpStatus.CREATED).send(notification);
});

/**
 * Get notifications by userId
 */
const getNotifications = catchAsync(async (req, res) => {
  const notifications = await notificationService.getNotificationsByUserId(req.params.userId);

  if (!notifications) {
    throw new ApiError(httpStatus.NOT_FOUND, "No notifications found for this user");
  }

  res.send(notifications);
});

/**
 * Update a notification by id
 */
const updateNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.updateNotificationById(
    req.params.notificationId,
    req.body
  );

  res.send(notification);
});

/**
 * Delete a notification by id
 */
const deleteNotification = catchAsync(async (req, res) => {
  await notificationService.deleteNotificationById(req.params.notificationId);

  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: "Notification was successfully deleted",
  });
});

module.exports = {
  createNotification,
  getNotifications,
  updateNotification,
  deleteNotification,
};
