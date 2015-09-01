'use strict';

var Joi = require('joi');

var boundsSchema = Joi.object().keys({
    horizontal: Joi.number().required(),
    vertical: Joi.number().required()
}).allow(undefined);

module.exports = {
    bounds: boundsSchema
};
