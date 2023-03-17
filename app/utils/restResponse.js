/**
 * @desc    This file contain Success and Error response for sending to client / user
 * @author  Riddhi Modi
 * @since   2020
 */

/**
 * @desc    Send any success response
 *
 * @param   {string} message
 * @param   {object | array} results
 * @param   {number} statusCode
 */
exports.success = (msg,dataGet = {}) => {
    let data = {}
    data.success = true;
    data.payload = dataGet;
    data.message = msg;
    // data.errors = [];
    // data.code = 200;
    return data;
};

exports.socketsuccess = (dataGet = {}, action, msg) => {
    let data = {}
    data.success = true;
    data.action = action;
    data.data = dataGet;
    data.message = msg;
    data.errors = [];
    data.code = 200;
    return data;
};

/**
 * @desc    Send any error response
 *
 * @param   {string} message
 * @param   {number} statusCode
 */
exports.error = (dataGet, statusCode, msg = "Error!", dataResponse = []) => {
    // List of common HTTP request code
    const codes = [200, 201, 400, 401, 404, 403, 422, 500];
    console.log(dataGet);
    // if (typeof dataGet == 'string') {
        msg = dataGet;
    // } else {
    //     msg = dataGet.join(',');
    // }
    // Get matched code
    const findCode = codes.find((code) => code == statusCode);
    if (!findCode) statusCode = 500;
    else statusCode = findCode;
    let data = {}
    data.success = false;
    data.message = msg;
    data.payload = dataResponse;

    // data.errors = dataGet;
    // data.code = statusCode;
    return data;
    // return {
    //     success: true,
    //     data,
    //     code: statusCode,
    // };
};

exports.socketerror = (dataGet, action, statusCode, msg = "Error!", dataResponse = []) => {
    // List of common HTTP request code
    const codes = [200, 201, 400, 401, 404, 403, 422, 500];
    if (typeof dataGet == 'string') {
        msg = dataGet;
    } else {
        msg = dataGet.join(',');
    }
    // Get matched code
    const findCode = codes.find((code) => code == statusCode);
    if (!findCode) statusCode = 500;
    else statusCode = findCode;
    let data = {}
    data.success = false;
    data.action = action;
    data.data = dataResponse;
    data.message = msg;
    data.errors = dataGet;
    data.code = statusCode;
    return data;
    // return {
    //     success: true,
    //     data,
    //     code: statusCode,
    // };
};

/**
 * @desc    Send any validation response
 *
 * @param   {object | array} errors
 */
exports.validation = (errors, dataResponse = []) => {
    let msg = 'Validation errors';
    if (typeof errors == 'string') {
        msg = errors;
    } else {
        msg = errors.join(',');
    }
    return {
        success: false,
        // error: true,
        code: 422,
        message: msg,
        // errors,
        payload: dataResponse
    };
};