const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const Notifications = require("../models/notifications.model");
const { sendNotification } = require("./onesignal.service");

/**
 * Create a notification
 * @param {Object} notificationBody
 * @returns {Promise<Notifications>}
 */
const createNotification = async (notificationBody) => {
    sendNotification(notificationBody.userId, notificationBody.title, notificationBody.text)
    return await Notifications.create(notificationBody);
};


/**
 * Get notification by id
 * @param {ObjectId} id
 * @returns {Promise<Notifications>}
 */
const getNotificationById = async (id) => {
    const notification = await Notifications.findOne({ where: { id } });
    if (!notification) {
        throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");
    }
    return notification;
};

/**
 * Get notifications by userId
 * @param {ObjectId} userId
 * @returns {Promise<Notifications[]>}
 */
const getNotificationsByUserId = async (userId) => {
    const notifications = await Notifications.findAll({ where: { userId } });
    return notifications;
};

/**
 * Update notification by id
 * @param {ObjectId} notificationId
 * @param {Object} updateBody
 * @returns {Promise<Notifications>}
 */
const updateNotificationById = async (notificationId, updateBody) => {
    const notification = await getNotificationById(notificationId);

    if (!notification) {
        throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");
    }

    Object.assign(notification, updateBody);
    await notification.save();
    return notification;
};

/**
 * Delete notification by id
 * @param {ObjectId} notificationId
 * @returns {Promise<void>}
 */
const deleteNotificationById = async (notificationId) => {
    const notification = await getNotificationById(notificationId);

    if (!notification) {
        throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");
    }

    await Notifications.destroy({ where: { id: notificationId } });
};


module.exports = {
    createNotification,
    getNotificationById,
    getNotificationsByUserId,
    updateNotificationById,
    deleteNotificationById,
};
