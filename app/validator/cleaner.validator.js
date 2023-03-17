const Joi = require('joi')

exports.add = Joi.object().keys({
    name : Joi.string()
        .required(),
    phone_no : Joi.string()
        .min(8)
        .max(15)
        .required(),
    email : Joi.string()
        .email()
        .required(),
    contract_file : Joi.allow('')
        .optional(),
    insurance_file : Joi.allow('')
        .optional(),
    insurance_expiry_date : Joi.date()
        // .min('now')
        .required(),
    email_alert : Joi.number()
        .integer()
        .required()
        .valid(0,1)
        .messages({
            "valid" : "Invalid value of Status"
        }),   
    address : Joi.string()
        .required(),
    suburb : Joi.string()
        .required(),
    postal_code : Joi.string()
        .min(4)
        .max(6)
        .required(),
    emergency_contact_name : Joi.string()
        .required(),
    emergency_phone_no : Joi.string()
        .min(8)
        .max(15)
        .required(),
    notes : Joi.string()
        .required(),
    travel_distance : Joi.number()
        .integer()
        .required(),    
    is_active : Joi.number()
        .integer()
        .optional()
        .valid(0,1)
        .messages({
            "valid" : "Invalid value of Status"
        }),
})

exports.update = Joi.object().keys({
    name : Joi.string()
        .required(),
    phone_no : Joi.string()
        .min(8)
        .max(15)
        .required(),
    email : Joi.string()
        .email()
        .required(),
    contract_file : Joi.allow('')
        .optional(),
    insurance_file : Joi.allow('')
        .optional(),
    insurance_expiry_date : Joi.date()
        .optional(),
    email_alert : Joi.number()
        .integer()
        .required()
        .valid(0,1)
        .messages({
            "valid" : "Invalid value of Status"
        }),   
    address : Joi.string()
        .required(),
    suburb : Joi.string()
        .required(),
    postal_code : Joi.string()
        .min(4)
        .max(6)
        .required(),
    emergency_contact_name : Joi.string()
        .required(),
    emergency_phone_no : Joi.string()
        .min(8)
        .max(15)
        .required(),
    notes : Joi.string()
        .required(),
    travel_distance : Joi.number()
        .integer()
        .required(),    
    is_active : Joi.number()
        .integer()
        .optional()
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