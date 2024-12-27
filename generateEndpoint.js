const fs = require("fs");
const path = require("path");

// Replace these with your Sequelize model definition
const modelName = "Product";
const modelAttributes = {
  name: "STRING",
  price: "DECIMAL(10, 2)",
};
const association = `
// Define any associations with other models here
`;

// Create the model file
const modelFileName = `${modelName.toLowerCase()}.model.js`;
const modelContent = `
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");

class ${modelName} extends Model {}

${modelName}.init(
  {
    ${Object.entries(modelAttributes)
      .map(
        ([attribute, type]) =>
          `${attribute}: { type: DataTypes.${type}, allowNull: false },`
      )
      .join("\n    ")}
  },
  {
    sequelize,
    modelName: "${modelName.toLowerCase()}",
  }
);

${association}

module.exports = ${modelName};
`;

fs.writeFileSync(path.join(__dirname, modelFileName), modelContent);

// Create the controller file
const controllerFileName = `${modelName.toLowerCase()}.controller.js`;
const controllerContent = `
const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { ${modelName} } = require("../models"); // Import your model as needed

const create${modelName} = catchAsync(async (req, res) => {
  const ${modelName.toLowerCase()} = await ${modelName}.create(req.body);
  res.status(httpStatus.CREATED).send(${modelName.toLowerCase()});
});

const get${modelName}s = catchAsync(async (req, res) => {
  const ${modelName.toLowerCase()}s = await ${modelName}.findAll();
  res.send(${modelName.toLowerCase()}s);
});

const get${modelName} = catchAsync(async (req, res) => {
  const { ${modelName.toLowerCase()}Id } = req.params;
  const ${modelName.toLowerCase()} = await ${modelName}.findByPk(${modelName.toLowerCase()}Id);

  if (!${modelName.toLowerCase()}) {
    throw new ApiError(httpStatus.NOT_FOUND, "${modelName} not found");
  }

  res.send(${modelName.toLowerCase()});
});

const update${modelName} = catchAsync(async (req, res) => {
  const { ${modelName.toLowerCase()}Id } = req.params;
  const ${modelName.toLowerCase()} = await ${modelName}.findByPk(${modelName.toLowerCase()}Id);

  if (!${modelName.toLowerCase()}) {
    throw new ApiError(httpStatus.NOT_FOUND, "${modelName} not found");
  }

  Object.assign(${modelName.toLowerCase()}, req.body);
  await ${modelName.toLowerCase()}.save();

  res.send(${modelName.toLowerCase()});
});

const delete${modelName} = catchAsync(async (req, res) => {
  const { ${modelName.toLowerCase()}Id } = req.params;
  const ${modelName.toLowerCase()} = await ${modelName}.findByPk(${modelName.toLowerCase()}Id);

  if (!${modelName.toLowerCase()}) {
    throw new ApiError(httpStatus.NOT_FOUND, "${modelName} not found");
  }

  await ${modelName.toLowerCase()}.destroy();

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  create${modelName},
  get${modelName}s,
  get${modelName},
  update${modelName},
  delete${modelName},
};
`;

fs.writeFileSync(path.join(__dirname, controllerFileName), controllerContent);

// Create the service file
const serviceFileName = `${modelName.toLowerCase()}.service.js`;
const serviceContent = `
const { ${modelName} } = require("../models"); // Import your model as needed

const create${modelName} = async (${modelName.toLowerCase()}Body) => {
  return ${modelName}.create(${modelName.toLowerCase()}Body);
};

const get${modelName}s = async () => {
  return ${modelName}.findAll();
};

const get${modelName}ById = async (${modelName.toLowerCase()}Id) => {
  return ${modelName}.findByPk(${modelName.toLowerCase()}Id);
};

const update${modelName}ById = async (${modelName.toLowerCase()}Id, updateBody) => {
  const ${modelName.toLowerCase()} = await get${modelName}ById(${modelName.toLowerCase()}Id);

  if (!${modelName.toLowerCase()}) {
    throw new Error("${modelName} not found");
  }

  Object.assign(${modelName.toLowerCase()}, updateBody);
  await ${modelName.toLowerCase()}.save();

  return ${modelName.toLowerCase()};
};

const delete${modelName}ById = async (${modelName.toLowerCase()}Id) => {
  const ${modelName.toLowerCase()} = await get${modelName}ById(${modelName.toLowerCase()}Id);

  if (!${modelName.toLowerCase()}) {
    throw new Error("${modelName} not found");
  }

  await ${modelName.toLowerCase()}.destroy();
};

module.exports = {
  create${modelName},
  get${modelName}s,
  get${modelName}ById,
  update${modelName}ById,
  delete${modelName}ById,
};
`;

fs.writeFileSync(path.join(__dirname, serviceFileName), serviceContent);

// Create the validation file
const validationFileName = `${modelName.toLowerCase()}.validation.js`;
const validationContent = `
const Joi = require("joi");

const create${modelName} = {
  body: Joi.object().keys({
    ${Object.keys(modelAttributes)
      .map((attribute) => `${attribute}: Joi.required(),`)
      .join("\n    ")}
  }),
};

const get${modelName}s = {
  query: Joi.object().keys({
    // Define your validation rules for querying ${modelName}s here
  }),
};

const get${modelName} = {
  params: Joi.object().keys({
    ${modelName.toLowerCase()}Id: Joi.number().integer().required(),
  }),
};

const update${modelName} = {
  params: Joi.object().keys({
    ${modelName.toLowerCase()}Id: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    ${Object.keys(modelAttributes)
      .map((attribute) => `${attribute}: Joi.any(),`)
      .join("\n    ")}
  }),
};

const delete${modelName} = {
  params: Joi.object().keys({
    ${modelName.toLowerCase()}Id: Joi.number().integer().required(),
  }),
};

module.exports = {
  create${modelName},
  get${modelName}s,
  get${modelName},
  update${modelName},
  delete${modelName},
};
`;

fs.writeFileSync(path.join(__dirname, validationFileName), validationContent);

// Create the routes file
const routesFileName = `${modelName.toLowerCase()}.routes.js`;
const routesContent = `
const auth = require("../middlewares/auth");
const express = require("express");
const ${modelName.toLowerCase()}Controller = require("../controllers/${modelName.toLowerCase()}.controller");
const ${modelName.toLowerCase()}Validation = require("../validations/${modelName.toLowerCase()}.validation");
const validate = require("../middlewares/validate");

const router = express.Router();

router
  .route("/")
  .post(
    auth, // Add authentication middleware if needed
    validate(${modelName.toLowerCase()}Validation.create${modelName}),
    ${modelName.toLowerCase()}Controller.create${modelName}
  )
  .get(
    auth, // Add authentication middleware if needed
    validate(${modelName.toLowerCase()}Validation.get${modelName}s),
    ${modelName.toLowerCase()}Controller.get${modelName}s
  );

router
  .route("/:${modelName.toLowerCase()}Id")
  .get(
    auth, // Add authentication middleware if needed
    validate(${modelName.toLowerCase()}Validation.get${modelName}),
    ${modelName.toLowerCase()}Controller.get${modelName}
  )
  .patch(
    auth, // Add authentication middleware if needed
    validate(${modelName.toLowerCase()}Validation.update${modelName}),
    ${modelName.toLowerCase()}Controller.update${modelName}
  )
  .delete(
    auth, // Add authentication middleware if needed
    validate(${modelName.toLowerCase()}Validation.delete${modelName}),
    ${modelName.toLowerCase()}Controller.delete${modelName}
  );

module.exports = router;
`;

fs.writeFileSync(path.join(__dirname, routesFileName), routesContent);

console.log(`Files for ${modelName} created successfully.`);
