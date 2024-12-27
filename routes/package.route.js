const auth = require("../middlewares/auth");
const express = require("express");
const packageController = require("../controllers/packages.controller");
const packageValidation = require("../validations/package.validation");
const validate = require("../middlewares/validate");

const router = express.Router();

router
  .route("/")
  .post(
    validate(packageValidation.createPackage),
    packageController.createPackage
  )
  .get(
    auth(),
    validate(packageValidation.getPackages),
    packageController.getPackages
  );

router.route("/multiple/:userId").patch(
  //auth(),
  //validate(packageValidation.updatePackage),
  packageController.updateMultiplePackages
);

router
  .route("/:PackageId")
  .get(
    auth(),
    validate(packageValidation.getPackage),
    packageController.getPackage
  )
  .patch(
    auth(),
    validate(packageValidation.updatePackage),
    packageController.updatePackage
  )
  .delete(
    auth(),
    validate(packageValidation.deletePackage),
    packageController.deletePackage
  );

module.exports = router;
