const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");

class Chat extends Model {}

Chat.init(
  {
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },

  {
    sequelize,
    modelName: "chat",
  }
);

module.exports = Chat;
