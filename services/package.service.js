const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const Package = require("../models/package.model");
const User = require("../models/user.model");
const { Op } = require("sequelize");

/**
 * Create a Package
 * @param {Object} packageBody
 * @returns {Promise<Package>}
 */
const createPackage = async (packageBody) => {
  return await Package.create(packageBody);
};

/**
 * Query for Packages
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPackages = async (filter, options) => {
  // @TODO: Create some pagination logic here
  const Packages = await Package.findAll();
  return Packages;
};

/**
 * Get Package by id
 * @param {ObjectId} id
 * @returns {Promise<Package>}
 */
const getPackageById = async (id) => {
  const package = await Package.findOne({ where: { id } });

  return package;
};

/**
 * Update Package by id
 * @param {ObjectId} PackageId
 * @param {Object} updateBody
 * @returns {Promise<Package>}
 */
const updatePackageById = async (PackageId, updateBody) => {
  const Package = await getPackageById(PackageId);
  if (!Package) {
    throw new ApiError(httpStatus.NOT_FOUND, "Package not found");
  }
  if (
    updateBody.email &&
    (await Package.isEmailTaken(updateBody.email, PackageId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(Package, updateBody);
  await Package.save();
  return { code: httpStatus.OK, message: "Worked !", package: Package };
};

const updateMultiplePackages = async (userId, updateBody) => {
  const { data } = updateBody;
  const { packages } = data;

  let totalCount = 0;
  let updatedCount = 0;
  const listOfIds = [];
  for (const category of packages) {
    if (category.packs && category.packs.length > 0) {
      for (const pack of category.packs) {
        if (!pack.id) {
          const created = await Package.create({
            ...pack,
            niche: category.name,
          });
          if (created) {
            totalCount++;
            updatedCount++;
            listOfIds.push(created.id);
          }
          continue;
        }
        listOfIds.push(pack.id);
        // Update Package model with pack.id and pack's other properties
        const [updated] = await Package.update(pack, {
          where: { id: pack.id },
        });
        totalCount++;
        if (updated === 1) {
          updatedCount++;
        }
      }
    }
  }

  // Delete packages not present in listOfIds
  const wasDestroyed = await Package.destroy({
    where: {
      id: {
        [Op.notIn]: listOfIds,
      },
    },
  });

  if (wasDestroyed > 0) {
    totalCount += wasDestroyed;
    updatedCount += wasDestroyed;
  }

  const user = await User.findOne({
    where: { id: userId },
    include: [{ model: Package }],
    order: [[Package, "id", "ASC"]],
  });

  if (updatedCount === totalCount) {
    return {
      code: httpStatus.OK,
      message: `Successfully updated ${updatedCount}/${totalCount} packages !`,
      user,
    };
  }
  return {
    code: httpStatus.INTERNAL_SERVER_ERROR,
    message: `Error: Only ${updatedCount}/${totalCount} updated.`,
    user,
  };
};
/**
 * Delete Package by id
 * @param {ObjectId} PackageId
 * @returns {Promise<Package>}
 */
const deletePackageById = async (PackageId) => {
  const Package = await getPackageById(PackageId);

  if (!Package) {
    throw new ApiError(httpStatus.NOT_FOUND, "Package not found");
  }

  const deletedPackage = await Package.destroy({ where: { id: PackageId } });

  return deletedPackage;
};

module.exports = {
  createPackage,
  queryPackages,
  getPackageById,
  updatePackageById,
  updateMultiplePackages,
  deletePackageById,
};
