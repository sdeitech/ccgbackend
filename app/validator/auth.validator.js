const Joi = require('joi')

const login = Joi.object().keys({
    email : Joi.string()
        .email()
        .required(),
    password : Joi.string()
        .required()
})

const changePassword = Joi.object().keys({
    oldpassword : Joi.string()
        .required(),
    newpassword : Joi.string()
        .min(3)
        .required()
})

const forgotPasswordEmail = Joi.object().keys({
    email : Joi.string()
        .email()
        .required()
})

const forgotPasswordOTPVerify = Joi.object().keys({
    email : Joi.string()
        .email()
        .required(),
    otp : Joi.required(),
})

const forgotPasswordReset = Joi.object().keys({
    email : Joi.string()
    .email()
    .required(),
    otp : Joi.required(),
    password : Joi.string()
        .required(),
    hashcode : Joi.required()
})

module.exports = {
    login,
    changePassword,
    forgotPasswordEmail,
    forgotPasswordOTPVerify,
    forgotPasswordReset
}