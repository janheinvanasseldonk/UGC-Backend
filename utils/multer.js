const multer = require("multer");
const { memoryStorage } = require("multer");
const AppError = require("./ApiError");
const path = require("path");

const storage = memoryStorage();

const upload = multer({
  storage: storage,
  // fileFilter: (req, file, callback) => {
  //   // Define supported image and video MIME types
  //   const imageMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/heic"];
  //   const videoMimeTypes = ["video/mp4", "video/quicktime"];
  //   const fileExtension = path.extname(file.originalname).toLowerCase();

  //   if (imageMimeTypes.includes(file.mimetype) || fileExtension === '.heic') {
  //     // For image files
  //     callback(null, true);
  //   } else if (videoMimeTypes.includes(file.mimetype)) {
  //     // For video files
  //     callback(null, true);
  //   } else {
  //     // For unsupported file types
  //     const error = new AppError(
  //       400,
  //       `Unsupported file type for ${file.originalname}! Please upload only images or videos`
  //     );
  //     callback(error, false);
  //   }
  // },
});

module.exports = upload;
