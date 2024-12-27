const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { requestService } = require("../services");

const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const storage = getStorage();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

initializeApp(firebaseConfig);

const createRequest = catchAsync(async (req, res) => {
  const imagesUrls = await Promise.all(
    req.files.map(async (file) => {
      const storageRef = ref(storage, `files/${file.originalname}`);

      const metadata = {
        contentType: file.mimetype,
      };

      const snapshot = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metadata
      );

      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    })
  );

  const body = {
    ...req.body,
    images: imagesUrls,
  };

  const request = await requestService.createRequest(body);
  res.status(httpStatus.CREATED).send(request);
});

const getRequests = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["name"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await requestService.queryRequests(filters, options);
  res.send(result);
});

const getRequest = catchAsync(async (req, res) => {
  const request = await requestService.getRequestById(req.params.requestId);

  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, "Request not found");
  }
  res.send(request);
});

const updateRequest = catchAsync(async (req, res) => {
  const request = await requestService.updateRequestById(
    req.params.RequestId,
    req.body
  );
  res.send(request);
});

const deleteRequest = catchAsync(async (req, res) => {
  await requestService.deleteRequestById(req.params.RequestId);
  res
    .status(httpStatus.OK)
    .send({ code: httpStatus.OK, message: "Request was succesfully deleted" });
});

module.exports = {
  createRequest,
  getRequests,
  getRequest,
  updateRequest,
  deleteRequest,
};
