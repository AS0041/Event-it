const joi = require("joi");

module.exports.joiPost = joi.object({
    title: joi.string().required(),
    description: joi.string().required()
}).required();

module.exports.joiUser = joi.object({
    email: joi.string().required(),
    username: joi.string().min(8).max(30).alphanum().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
}).required();

