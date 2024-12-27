const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");
class Notifications extends Model { }

Notifications.init(
    {
        userId: {
            type: DataTypes.INTEGER,
        },
        text: {
            type: DataTypes.STRING,
        },
        title: {
            type: DataTypes.STRING,
        },
        orderId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        creatorId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "notifications",
    }
);

module.exports = Notifications;
