const auth = require("../middlewares/auth");
const authController = require("../controllers/auth.controller");
const authValidation = require("../validations/auth.validation");
const userValidation = require("../validations/user.validation");
const express = require("express");
const validate = require("../middlewares/validate");
const upload = require("../utils/multer")

const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new uer
 *     description: Create a new profiel for a user
 */
router.post(
  "/register",
  [
    upload.fields([
      { name: "profilePicture" },
      { name: "video1" },
      { name: "video2" },
      { name: "video3" },
      { name: "video4" },
    ]),
    validate(userValidation.createUser),
  ],
  authController.register
);

router.post(
  "/validate-email",
    validate(userValidation.validateEmail),
  authController.validateEmail
);


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login to get access tokens
 *     description: Create a new profiel for a user
 */
router.post("/login", validate(authValidation.login), authController.login);
router.post("/login-resend", validate(authValidation.resendLogin), authController.loginResend);
router.post("/two-factor-authentication", validate(authValidation.twoFactor), authController.verify2FA);
router.post("/logout", validate(authValidation.logout), authController.logout);
router.post(
  "/refresh-tokens",
  validate(authValidation.refreshTokens),
  authController.refreshTokens
);
router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPassword
);
router.post(
  "/send-verification-email",
  auth(),
  authController.sendVerificationEmail
);
router.post(
  "/verify-email",
  validate(authValidation.verifyEmail),
  authController.verifyEmail
);


router.post(
  "/change-password",
  auth(), 
  validate(authValidation.changePassword), 
  authController.changePassword 
);

module.exports = router;
