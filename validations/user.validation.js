const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    profileName: Joi.string(),
    role: Joi.string().required().valid("user", "admin", "creator", "company"),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    companyName: Joi.string(),
    ccn: Joi.string().allow(null, ''),
    btwNumber: Joi.string().allow(null, ''),
    dayOfBirth: Joi.string(),
    gender: Joi.string(),
    street: Joi.string(),
    houseNumber: Joi.string(),
    postalCode: Joi.string(),
    city: Joi.string(),
    country: Joi.string(),
    physicalStreet: Joi.string(),
    physicalHouseNumber: Joi.string(),
    physicalPostalCode: Joi.string(),
    physicalCity: Joi.string(),
    physicalCountry: Joi.string(),
    phoneNumber: Joi.string().required(),
    bio: Joi.string(),
    niches: Joi.string(),
    languages: Joi.string(),
  }),
};


const validateEmail = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    role: Joi.string().required().valid("user", "admin", "creator", "company"),
  }),
};


const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    gender: Joi.string().allow(null, ''),
    age: Joi.number().allow(null, ''),
    price: Joi.string().allow(null, ''),
    languages: Joi.string().allow(null, ''),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    niches: Joi.string().allow(null, ''),
    topCreator: Joi.boolean(),
    withVideo: Joi.boolean(),
    search: Joi.string().allow(null, ''),
    distance: Joi.number().integer().allow(null),
    userId: Joi.string().allow(null, ''),
    availability: Joi.boolean().allow(null)
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const uploadFile = {
  body: Joi.object()
    .keys({
      video1: Joi.any(),
    })
}

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      id: Joi.number(),
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      postalCode: Joi.string(),
      street: Joi.string(),
      country: Joi.string(),
      city: Joi.string(),
      physicalStreet: Joi.string(),
      physicalHouseNumber: Joi.string(),
      physicalPostalCode: Joi.string(),
      physicalCity: Joi.string(),
      physicalCountry: Joi.string(),
      slogan: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      houseNumber: Joi.string(),
      phoneNumber: Joi.string(),
      niches: Joi.string(),
      moneyBalance: Joi.number().allow(null),
      companyName: Joi.string().allow(null),
      ccn: Joi.string().allow(null),
      dayOfBirth: Joi.date().allow(null),
      gender: Joi.string().allow(null),
      bio: Joi.string().allow(null),
      profileName: Joi.string().allow(null),
      languages: Joi.string().allow(null),
      role: Joi.string().allow(null),
      isEmailVerified: Joi.boolean().allow(null),
      availability: Joi.boolean().allow(null),
      stripeAccountId: Joi.string().allow(null),
      createdAt: Joi.string().allow(null),
      updatedAt: Joi.string().allow(null),
      profilePicture: Joi.any(),
      video1: Joi.any(),
      video2: Joi.any(),
      video3: Joi.any(),
      video4: Joi.any(),
      bedrijfsnaam: Joi.string().allow(null),
      btwNumber: Joi.string().allow(null),
      accountNumber: Joi.string().allow(null),
      billingEmail: Joi.string().allow(null),
      isBusiness: Joi.boolean().allow(null),
      useAlternateEmail: Joi.boolean().allow(null),
      lastSeenSettings: Joi.boolean().allow(null),
      onlineSettings: Joi.boolean().allow(null),
      pushNotificationSettings: Joi.boolean().allow(null),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    reason: Joi.string().required()
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  validateEmail,
  uploadFile
};
