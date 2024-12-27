const { DataTypes, Model, Op } = require("sequelize");
const sequelize = require("../config/sequelize");
const bcrypt = require("bcryptjs");

class User extends Model {
  // Static method to check if email is taken
  static async isEmailTaken(email, userId) {
    const whereConditions = { email: email };

    if (userId) {
      whereConditions.id = { [Op.ne]: userId };
    }

    const user = await User.findOne({
      where: whereConditions,
    });

    return !!user; // return true if user exists, otherwise false
  }
}

User.init(
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING,
    },
    ccn: {
      type: DataTypes.STRING,
    },
    dayOfBirth: {
      type: DataTypes.DATE,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING,
    },
    houseNumber: {
      type: DataTypes.STRING,
    },
    postalCode: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    physicalStreet: {
      type: DataTypes.STRING,
    },
    physicalHouseNumber: {
      type: DataTypes.STRING,
    },
    physicalPostalCode: {
      type: DataTypes.STRING,
    },
    physicalCity: {
      type: DataTypes.STRING,
    },
    physicalCountry: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.STRING,
    },
    niches: {
      type: DataTypes.STRING,
    },
    profilePicture: {
      type: DataTypes.STRING,
    },
    profileName: {
      type: DataTypes.STRING,
    },
    languages: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM("creator", "user", "admin", "company"),
      defaultValue: "creator",
    },
    rank: {
      type: DataTypes.ENUM('2', '1', '0'),
      defaultValue: "0",
    },
    video1: {
      type: DataTypes.STRING(1000),
    },
    video2: {
      type: DataTypes.STRING(1000),
    },
    video3: {
      type: DataTypes.STRING(1000),
    },
    video4: {
      type: DataTypes.STRING(1000),
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
    },
    availability: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    moneyBalance: {
      type: DataTypes.FLOAT,
    },
    stripeAccountId: {
      type: DataTypes.STRING(500),
    },
    btwNumber: {
      type: DataTypes.STRING,
    },
    accountNumber: {
      type: DataTypes.STRING,
    },
    billingEmail: {
      type: DataTypes.STRING,
    },
    isBusiness: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    useAlternateEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    topCreator: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastSeenSettings: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    onlineSettings: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    pushNotificationSettings: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    blueVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    goldVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    FAToken: {
      type: DataTypes.STRING(1000),
    },
    oneSignal: {
      type: DataTypes.STRING(1000),
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastActivity: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: "user",
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 8);
      },
    },
  }
);

module.exports = User;
