const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");

class Request extends Model {}

Request.init(
  {
    nameOfProduct: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    uitspraak: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: false,
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    language: {
      type: DataTypes.STRING,
    },
    height: {
      type: DataTypes.INTEGER,
    },
    hairstyle: {
      type: DataTypes.STRING,
    },
    bodyType: {
      type: DataTypes.STRING,
    },
    budget: {
      type: DataTypes.STRING,
    },
  },

  {
    sequelize,
    modelName: "request",
  }
);

module.exports = Request;
