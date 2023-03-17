const Joi = require('joi')

exports.add = Joi.object().keys({
    name: Joi.string()
        .required(),
    address: Joi.string()
        .required(),
    suburb: Joi.string()
        .required(),
    postal_code: Joi.string()
        .min(4)
        .max(6)
        .required(),
    phone_no: Joi.string()
        .min(8)
        .max(15)
        .required(),
    schedule_task: Joi.string().
        required(),
    frequency: Joi.string()
        .required(),
    investment: Joi.string()
        .required(),
    weekly_quoted_price: Joi.string()
        .required(),
    cleaner_weekly_amount: Joi.string()
        .required(),
    additional_weekly_cost: Joi.string()
        .allow('')
        .optional(),
    site_contract: Joi.allow('')
        .optional(),
    cleaning_scope: Joi.allow('')
        .optional(),
    recurring_clean: Joi.string()
        .required(),
    days: Joi.array()
        .min(1)
        .max(7)
        .required(),
    start_time: Joi.string()
        .required(),
    finish_time: Joi.string()
        .required(),
    cleaners: Joi.array()
        .min(1)
        .required(),
    alarm_code: Joi.string()
        .allow('')
        .optional(),
    key_types: Joi.array()
        .min(1)
        .required(),
    total_keys: Joi.number().integer()
        .required(),
    notes: Joi.string()
        .allow('')
        .optional(),
    client: Joi.string()
        .required()
})

exports.update = Joi.object().keys({
    name: Joi.string()
        .required(),
    address: Joi.string()
        .required(),
    suburb: Joi.string()
        .required(),
    postal_code: Joi.string()
        .min(4)
        .max(6)
        .required(),
    phone_no: Joi.string()
        .min(8)
        .max(15)
        .required(),
    schedule_task: Joi.string().
        required(),
    frequency: Joi.string()
        .required(),
    investment: Joi.string()
        .required(),
    weekly_quoted_price: Joi.string()
        .required(),
    cleaner_weekly_amount: Joi.string()
        .required(),
    additional_weekly_cost: Joi.string()
        .allow('')
        .optional(),
    site_contract: Joi.allow('')
        .optional(),
    cleaning_scope: Joi.allow('')
        .optional(),
    recurring_clean: Joi.string()
        .required(),
    days: Joi.array()
        .min(1)
        .max(7)
        .required(),
    start_time: Joi.string()
        .required(),
    finish_time: Joi.string()
        .required(),
    cleaners: Joi.array()
        .min(1)
        .required(),
    alarm_code: Joi.string()
        .allow('')
        .optional(),
    key_types: Joi.array()
        .min(1)
        .required(),
        total_keys: Joi.number().integer()
        .required(),
    notes: Joi.string()
        .allow('')
        .optional()
})

exports.updateStatus = Joi.object().keys({
    is_active : Joi.number()
        .integer()
        .required()
        .valid(0,1)
        .messages({
            'valid' : 'Invalid value of Status'
        })
})