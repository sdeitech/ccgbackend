const Joi = require('joi')

exports.add = Joi.object().keys({
    client_name : Joi.string()
        .required(),
    organisation : Joi.string()
        .required(), 
    lead_status : Joi.string()
        .required(), 
    client_email : Joi.string()
        .email()
        .required(),
    phone_no : Joi.string()
        .min(8)
        .max(15)
        .required(),
    website : Joi.string()
        .optional(), 
    industry : Joi.string()
        .required(),
    source : Joi.string()
        .required(),
    lead_user : Joi.string()
        .required(),
    description : Joi.string()
        .optional(),
    address : Joi.string()
        .required(),
    suburb : Joi.string()
        .required(),
    postal_code : Joi.string()
        .min(4)
        .max(6)
        .required(),
    country : Joi.string()
        .optional(),
    state : Joi.string()
        .optional(),
    city : Joi.string()
        .optional()
})

exports.update = Joi.object().keys({
    client_name : Joi.string()
    .required(),
    organisation : Joi.string()
        .required(), 
    lead_status : Joi.string()
        .required(), 
    client_email : Joi.string()
        .email()
        .required(),
    phone_no : Joi.string()
        .min(8)
        .max(15)
        .required(),
    website : Joi.string()
        .optional(), 
    industry : Joi.string()
        .required(),
    source : Joi.string()
        .required(),
    lead_user : Joi.string()
        .optional(),
    description : Joi.string()
        .optional(),
    address : Joi.string()
        .required(),
    suburb : Joi.string()
        .required(),
    postal_code : Joi.string()
        .min(4)
        .max(6)
        .required(),
    country : Joi.string()
        .optional(),
    state : Joi.string()
        .optional(),
    city : Joi.string()
        .optional()
})

exports.updateStatus = Joi.object().keys({
    lead_status : Joi.number()
        .integer()
        .required()
        .valid(1,2,3,4,5)
        .messages({
            'valid' : 'Invalid value of Status'
        })
})