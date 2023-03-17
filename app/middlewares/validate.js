const err = require('../utils/restResponse').error;

exports.validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body)
    if(error) {
        return res.send(err(error.details[0].message))
    } else {
        next()
    }
}
