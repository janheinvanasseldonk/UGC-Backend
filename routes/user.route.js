const auth = require("../middlewares/auth");
const express = require("express");
const userController = require("../controllers/user.controller");
const userValidation = require("../validations/user.validation");
const validate = require("../middlewares/validate");
const upload = require("../utils/multer");

const router = express.Router();

router
  .route("/")
  .post(
    auth("manageUsers"),
    validate(userValidation.createUser),
    userController.createUser
  )
  .get(validate(userValidation.getUsers), userController.getUsers);

router
  .route('/summary/:userId')
  .get(
    // auth(),
    validate(userValidation.getUser),
    userController.getUserMoneySummary
  )

router
  .route("/orders-wordpress")
  .post(
    userController.badgeCheck
  )


router
  .route('/upload')
  .post(
    upload.fields([
      { name: "video1", maxCount: 1 }
    ]),
    // validate(userValidation.uploadFile),
    userController.uploadFile
  )
router
  .route("/:userId")
  .get(
    // auth(),
    validate(userValidation.getUser),
    userController.getUser
  )
  .patch(
    // auth("updateRequests"),
    upload.fields([
      { name: "profilePicture", maxCount: 1 },
      { name: "video1" },
      { name: "video2" },
      { name: "video3" },
      { name: "video4" }
    ]),
    validate(userValidation.updateUser),
    userController.updateUser
  )
  .delete(
    auth(),
    validate(userValidation.deleteUser),
    userController.deleteUser
  );

module.exports = router;
