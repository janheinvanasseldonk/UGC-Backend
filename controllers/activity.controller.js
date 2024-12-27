const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { initializeApp } = require("firebase/app");
const Uploader = require("../utils/uploader");

const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const activityService = require("../services/activity.service")

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

initializeApp(firebaseConfig);

const storage = getStorage();


const createActivity = catchAsync(async (req, res) => {
  const { body } = req;
  let activity
  console.log(req.files)

  if (!(req.files && Object.keys(req.files).length >= 1)) {
    activity = await activityService.createActivity({
      ...body,
      userId: Number(body.userId),
      message: body.message ? body.message : null,
      attachment: null,
      orderId: Number(body.orderId)
    });
  } else {
    const { attachment } = req.files;
    let attachmentLink = null;
    if (attachment) {
      attachmentLink = await Uploader({
        location: "aws_s3",
        file: attachment[0],
        sizeLimit: true,
      });
    }
    activity = await activityService.createActivity({
      ...body,
      userId: Number(body.userId),
      message: body.message ? body.message : null,
      attachment: attachmentLink,
      orderId: Number(body.orderId)
    });

  }

  if (!activity) {
    res.send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to Send Activity!",
    });
    return;
  }

  res.status(httpStatus.CREATED).send(activity);
});


const getActivityByOrderId = catchAsync(async (req, res) => {
  const activity = await activityService.getActivityByOrderId(req.params.orderId);

  if (!activity) {
    throw new ApiError(httpStatus.NOT_FOUND, "activity not found");
  }
  res.send(activity);
});


const updateActivityById = catchAsync(async (req, res) => {
  const activity = await activityService.updateActivity(
    req.params.orderId,
    req.body
  );
  res.send(activity);
});

const getActivityCount = catchAsync(async (req, res) => {
  const activity = await activityService.getActivityCountForOrderId(
    req.params.orderId,
    req.params.userId
  );
  res.send(activity);
});


module.exports = {
  createActivity,
  updateActivityById,
  getActivityByOrderId,
  getActivityCount
};
