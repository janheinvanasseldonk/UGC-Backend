const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
// const { tokenTypes } = require("./tokens");
const config = require("./config");
const User = require("../models/user.model");

const { userService } = require("../services/index");

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    // if (payload.type !== tokenTypes.ACCESS) {
    //   throw new Error("Invalid token type");
    // }
    const user = await userService.getUserById(payload.sub);

    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
