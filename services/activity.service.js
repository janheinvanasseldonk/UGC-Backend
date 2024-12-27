const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const Order = require("../models/order.model");
const paginate = require("../utils/paginate");
const Package = require("../models/package.model");
const { User, Offer } = require("../models");
const Activity = require("../models/activity.model");
const { Op } = require("sequelize");

/**
 * Create a activity
 * @param {Object} activityBody
 * @returns {Promise<activity>}
 */
const createActivity = async (activityBody) => {
  return await Activity.create(activityBody);
};

/**
 * Get activity by order id
 * @param {ObjectId} orderId
 * @returns {Promise<Activity>}
 */
const getActivityByOrderId = async (orderId) => {
  const activity = await Activity.findAll({
    where: { orderId },
    include: [
      { model: User, as: "user" }
    ],
  });

  return activity;
};

const getActivityCountForOrderId = async (orderId, userId) => {
  const activity = await Activity.count({
    where: {
      orderId: orderId,
      userId: { [Op.ne]: userId },  
      seen: false 
    },
  });
  return { count: activity };
};



/**
 * Update an activity by id
 * @param {ObjectId} activityId
 * @param {Object} updateBody
 * @returns {Promise<Activity>}
 */
const updateActivity = async (activityId, updateBody) => {
  console.log("DAta: ",activityId, updateBody)
  const activity = await Activity.findOne({
    where: { activityId }
  });
  if (!activity) {
    throw new ApiError(httpStatus.NOT_FOUND, "Activity not found");
  }

  Object.assign(activity, updateBody);
  await activity.save();

  return activity;
};

module.exports = {
  createActivity,
  getActivityByOrderId,
  updateActivity,
  getActivityCountForOrderId
};
