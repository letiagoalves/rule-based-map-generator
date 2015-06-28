'use strict';

var Joi = require('joi');
var util = require('util');

/**
 * Asserts that a bounds object is valid, meaning maxX and maxY must be greater than minX and minY respectively
 * @param  {Object} bounds
 * @param  {Number} bounds.minX
 * @param  {Number} bounds.minY
 * @param  {Number} bounds.maxX
 * @param  {Number} bounds.maxY
 */
function assertBounds(bounds) {
    Joi.assert(bounds, Joi.object().required().keys({
        minX: Joi.number().required().less(Joi.ref('maxX')),
        maxX: Joi.number().required(),
        minY: Joi.number().required().less(Joi.ref('maxY')),
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
