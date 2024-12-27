const Joi = require("joi");

const sendNotification = {
    body: Joi.object().keys({
        playerId: Joi.string().required(),
        heading: Joi.string().required(),
        content: Joi.string().required(),
    }),
};

module.exports = {
    sendNotification,
};
