const S3Uploader = require("./s3Uploder");
const FireBaseUploader = require("./firebaseUploader");
const ApiError = require("./ApiError");

let DefaultPlatform = process.env?.UPLOADER_PLATFORM || "firebase";

let ImageFileSizeLimit = process.env.IMAGE_SIZE || (1 * 1024 * 1024)
let VideoFileSizeLimit = process.env.VIDEO_SIZE || (10 * 1024 * 1024)

/**
 * Function description.
 * @param {Object} params - Parameters object.
 * @param {"aws_s3"|"firebase"} [params.location=""] - The location string. Can be "x" or "y".
 * @param {Boolean} [params.sizeLimit] - The location string. Can be "x" or "y".
 * @param {Number} [params.customeSizeLimit] - The location string. Can be "x" or "y".
 * @param {"aws_s3"|"firebase"} [params.location=""] - The location string. Can be "x" or "y".
 * @param {File} params.file - The file object.
 */
const UploadFile = ({ location = DefaultPlatform, file, onProgress }) => {
  if (location === "aws_s3") {
    return S3Uploader(file, onProgress);
  } else {
    return FireBaseUploader(file);
  }
};

module.exports = UploadFile;
