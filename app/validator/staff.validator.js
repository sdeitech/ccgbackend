const Joi = require('joi')

exports.add = Joi.object().keys({
    first_name : Joi.string()
        .required(),
    last_name : Joi.string()
        .required(), 
    email : Joi.string()
        .email()
        .required(),
        gender :Joi.number()
        .integer()
        .optional()
        .valid(1,2)
        .messages({
            "valid" : "Invalid value of Status"
        }),
    phone_no : Joi.string()
        .min(8)
        .max(15)
        .required(),
    role : Joi.number()
        .integer()
        .optional(),
    address : Joi.string()
        .required(),
    is_active : Joi.number()
        .integer()
        .optional()
        .valid(0,1)
        .messages({
            "valid" : "Invalid value of Status"
        })
})

exports.update = Joi.object().keys({
    first_name : Joi.string()
        .required(),
    last_name : Joi.string()
        .required(), 
    email : Joi.string()
        .email()
        .required(),
    gender :Joi.number()
        .integer()
        .optional()
        .valid(1,2)
        .messages({
            "valid" : "Invalid value of Status"
        }),
    phone_no : Joi.string()
        .min(8)
        .max(15)
        .required(),
    role : Joi.number()
        .integer()
        .optional(),
    is_active : Joi.number()
        .integer()
        .optional()
        .valid(0,1)
        .messages({
            "valid" : "Invalid value of Status"
        }),
    address : Joi.string()
        .required(),
})

exports.updateStatus = Joi.object().keys({
    is_active : Joi.number()
        .integer()
        .required()
        .valid(0,1)
        .messages({
            "valid" : "Invalid value of Status"
        })
})

exports.login = Joi.object().keys({
    email : Joi.string()
        .email()
        .required(),
    password : Joi.string()
        .required()
})