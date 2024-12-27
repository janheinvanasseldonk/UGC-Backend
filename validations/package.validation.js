const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createPackage = {
  body: Joi.object().keys({
    numberOfVideos: Joi.number().required(),
    totalCost: Joi.number().required(),
    durationPerVideo: Joi.number().required(),
    tiktokVideo: Joi.boolean().allow(null),
    instagramStory: Joi.boolean().allow(null),
    instagramReels: Joi.boolean().allow(null),
    snapchatAds: Joi.boolean().allow(null),
    voiceover: Joi.boolean(),
    music: Joi.boolean().allow(null),
    subtitle: Joi.boolean(),
    niche: Joi.string().allow(null),
    name: Joi.string(),
    description: Joi.string(),
    available: Joi.boolean(),
    script: Joi.boolean(),
    videoEditing: Joi.boolean(),
    rawContent: Joi.boolean(),
    physicalProducts: Joi.boolean(),
    revisions: Joi.number(),
    deliveryTime: Joi.string(),
    usageRights: Joi.string(),
    userId: Joi.string(),
  }),
};

const getPackages = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPackage = {
  params: Joi.object().keys({
    PackageId: Joi.string().required(),
  }),
};

const updatePackage = {
  params: Joi.object().keys({
    PackageId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      numberOfVideos: Joi.number().required(),
      totalCost: Joi.number().required(),
      durationPerVideo: Joi.number().required(),
      tiktokVideo: Joi.boolean().allow(null),
      instagramStory: Joi.boolean().allow(null),
      instagramReels: Joi.boolean().allow(null),
      snapchatAds: Joi.boolean().allow(null),
      voiceover: Joi.boolean(),
      music: Joi.boolean().allow(null),
      subtitle: Joi.boolean(),
      niche: Joi.string().allow(null),
      name: Joi.string(),
      description: Joi.string(),
      available: Joi.boolean(),
      script: Joi.boolean(),
      videoEditing: Joi.boolean(),
      rawContent: Joi.boolean(),
      physicalProducts: Joi.boolean(),
      revisions: Joi.number(),
      deliveryTime: Joi.string(),
      usageRights: Joi.string(),
      userId: Joi.string(),
    })
    .min(1),
};

const deletePackage = {
  params: Joi.object().keys({
    packageId: Joi.string().required(),
  }),
};

module.exports = {
  createPackage,
  getPackages,
  getPackage,
  updatePackage,
  deletePackage,
};
