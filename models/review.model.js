const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");

class Review extends Model {}

Review.init(
  {
    text: {
      type: DataTypes.STRING,
    },
    stars: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 5,
      },
    },
  },

  {
    sequelize,
    modelName: "review",
  }
);

module.exports = Review;
