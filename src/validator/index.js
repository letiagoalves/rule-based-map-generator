'use strict';

var Joi = require('joi');
var util = require('util');

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
