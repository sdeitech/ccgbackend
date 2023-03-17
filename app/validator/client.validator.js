const Joi = require('joi')

exports.add = Joi.object().keys({
    business_name: Joi.string()
        .required(),
    business_phone_no: Joi.string()
        .min(8)
        .max(15)
        .required(),
    contact_name: Joi.string()
        .required(),
    contact_email: Joi.string()
        .email()
        .required(),
    contact_phone_no: Joi.string()
        .min(8)
        .max(15)
        .required(),
    website: Joi.string()
        .optional(),
    industry: Joi.string()
        .required(),
    source: Joi.string()
        .required(),
    comment: Joi.string()
        .optional(),
    is_active : Joi.number()
        .integer()
        .optional()
        .valid(0,1)
        .messages({
            "valid" : "Invalid value of Status"
        })
})

exports.update = Joi.object().keys({
    business_name : Joi.string()
    .required(),
    business_phone_no : Joi.string()
        .min(8)
        .max(15)
        .optional(),
    contact_name : Joi.string()
        .optional(),
    contact_email : Joi.string()
        .email()
        .required(),
    contact_phone_no : Joi.string()
        .min(8)
        .max(15)
        .required(),
    website : Joi.string()
        .optional(),
    industry : Joi.string()
        .required(),
    source : Joi.string()
        .required(),
    comment : Joi.string()
        .optional(), 
    is_active : Joi.number()
        .integer()
        .required()
        .valid(0,1)
        .messages({
            "valid" : "Invalid value of Status"
        }),
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