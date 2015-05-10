'use strict';

var Joi = require('joi');
var util = require('util');

/**
 * Validates a value with a given schema
 * @param  {Any}    value       The value to validate
 * @param  {Object} schema      The schema used to validate
 * @param  {String} message     Error message if validations fails
 * @return {Any}                Validated value
 */
function assert(value, schema, message) {
    var newValue;
    Joi.validate(value, schema, { abortEarly: false }, function (err, validatedValue) {
        if(err) {
            console.error(message, util.inspect(err));
            throw err;
        }
        newValue = validatedValue;
    });

    return newValue;
}

module.exports = {
    assert: assert
};
