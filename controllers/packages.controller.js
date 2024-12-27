const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { packageService } = require("../services");
const Package = require("../models/package.model");

const createPackage = catchAsync(async (req, res) => {
  console.log("asd: ", req.body)
  const existingPackage = await Package.findOne({ where: { userId: req.body.userId, name: req.body.name } });

  console.log('existing', existingPackage)

  if (existingPackage) {
    return res.status(httpStatus.CONFLICT).json({ message: 'A package with the same userId and name already exists' });
  }


  const package = await packageService.createPackage(req.body);
  res.status(httpStatus.CREATED).send(package);
});

const getPackages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await packageService.queryPackages(filter, options);
  res.send(result);
});

const getPackage = catchAsync(async (req, res) => {
  const package = await packageService.getPackageById(req.params.PackageId);

  if (!package) {
    throw new ApiError(httpStatus.NOT_FOUND, "Package not found");
  }
  res.send(package);
});

const updatePackage = catchAsync(async (req, res) => {
  const package = await packageService.updatePackageById(
    req.params.PackageId,
    req.body
  );
  res.send(package);
});

const updateMultiplePackages = catchAsync(async (req, res) => {
  const package = await packageService.updateMultiplePackages(
    req.params.userId,
    req.body
  );
  res.send(package);
});

const deletePackage = catchAsync(async (req, res) => {
  await packageService.deletePackageById(req.params.PackageId);
  res
    .status(httpStatus.OK)
    .send({ code: httpStatus.OK, message: "Package was succesfully deleted" });
});

const getPackagesByUserId = catchAsync(async (req, res) => {
  const result = await packageService.getPackagesByUser(req.params.userId);
  res.send(result);
});

module.exports = {
  createPackage,
  getPackages,
  getPackage,
  updatePackage,
  updateMultiplePackages,
  deletePackage,
  getPackagesByUserId
};
