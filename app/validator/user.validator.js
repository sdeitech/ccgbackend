const Joi = require('joi')

exports.update = Joi.object().keys({
    first_name : Joi.string()
        .required(),
    last_name : Joi.string()
        .required(), 
    // email : Joi.string()
    //     .email()
    //     .required(),
    gender : Joi.string()
        .required(),
    phone_no : Joi.string()
        .min(8)
        .max(15)
        .required(),
    address : Joi.string()
        .required(),
})