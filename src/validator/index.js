'use strict';

var Joi = require('joi');
var util = require('util');

function assertBounds(bounds) {
    Joi.assert(bounds, Joi.object().keys({
        minX: Joi.number().less(Joi.ref('maxX')).required(),
        maxX: Joi.number().required(),
        minY: Joi.number().less(Joi.ref('maxY')).required(),
        maxY: Joi.number().required()
    }));
}

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
    assert: assert,
    assertBounds: assertBounds
};
