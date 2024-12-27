const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { onesignalService } = require("../services");

/**
 * Send notification to specific users
 */
const sendNotificationController = catchAsync(async (req, res) => {
    const { playerId, heading, content } = req.body;

    if (!playerId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "No player IDs provided");
    }
    
    console.log(playerId, heading, content)
    await onesignalService.sendNotification(playerId, heading, content);

    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        message: "Notification sent successfully",
    });
});

module.exports = {
    sendNotificationController,
};
